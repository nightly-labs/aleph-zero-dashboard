import type { ApiPromise } from '@polkadot/api';
import { rmCommas } from '@polkadot-cloud/utils';
import { TypeRegistry, u128 } from '@polkadot/types';
import BN from 'bn.js';
import { DECIMALS } from './consts';
import type { EraData } from './types';

/**
 * Warning: Lots of "ts-ignore"s due to incorrect api library's types.
 */
export default (api: ApiPromise, era: number) => {
  const registry = new TypeRegistry();

  return Promise.all([
    api.query.staking
      .erasValidatorReward(era)
      .then((tRP) => new BN(tRP.toString())),
    api.query.staking.erasRewardPoints(era).then((rp) => ({
      // @ts-expect-error TS2339: Contrary to the TS error, "total" does exist
      total: rp.total.toBn(),
      // @ts-expect-error TS2339: Contrary to the TS error, "individual" does exist
      perValidator: [...rp.individual.entries()].map(
        ([rawValidatorId, rawPoints]) => ({
          validatorId: rawValidatorId.toString(),
          rewardPoints: rawPoints.toBn(),
        })
      ),
    })),
    api.query.staking.erasStakersOverview.entries(era).then(
      (stakers) =>
        stakers?.map(([args, data]) => {
          // @ts-expect-error TS2339: Contrary to the TS error "own" and "total" do exist
          const { total, own } = data.toHuman();
          const validatorId =
            (args?.toHuman() as string[] | undefined)?.[1] || '';

          return {
            validatorId,
            ownStake: new u128(registry, rmCommas(own)),
            total: new u128(registry, rmCommas(total)),
          };
        })
    ),
    api.query.staking.erasStakersPaged.entries(era).then((stakers) =>
      stakers.reduce(
        (
          acc,
          [
            {
              args: [, rawValidatorId],
            },
            data,
          ]
        ) => {
          const validatorId = rawValidatorId.toString();
          // @ts-expect-error TS2339: Contrary to the TS error "others" do exist
          const { others } = data.toHuman();
          // @ts-expect-error TS2339: Contrary to the TS error "who" and "value" do exist
          const nominatorsStakes = others.map(({ who, value }) => ({
            nominatorId: rmCommas(who),
            value: new u128(registry, rmCommas(value)),
          }));

          acc.set(validatorId, [
            ...(acc.get(validatorId) || []),
            ...nominatorsStakes,
          ]);
          return acc;
        },
        new Map<string, { nominatorId: string; value: u128 }[]>()
      )
    ),
    api.query.staking.erasValidatorPrefs.entries(era).then((commissions) =>
      commissions.map(
        ([
          {
            args: [, rawValidatorId],
          },
          // @ts-expect-error TS2339: Contrary to the TS error, "commission" does exist
          { commission: rawCommission },
        ]) => ({
          validatorId: rawValidatorId.toString(),
          // Multiply by 10^(DECIMALS - 9), because "commission" is returned in "Perbil"
          commission: rawCommission
            .toBn()
            .mul(new BN(10).pow(new BN(DECIMALS - 9))),
        })
      )
    ),
  ]).then(
    ([
      totalEraRewardPoints,
      allAwardedRewardPoints,
      stakesOverview,
      allStakes,
      allCommissions,
    ]) => {
      const perValidatorData: EraData['perValidator'] = {};

      allAwardedRewardPoints.perValidator.forEach(
        ({ validatorId, rewardPoints }) => {
          perValidatorData[validatorId] = {
            ...perValidatorData[validatorId],
            rewardPoints,
          };
        }
      );

      stakesOverview.forEach(({ validatorId, ownStake, total }) => {
        perValidatorData[validatorId] = {
          ...perValidatorData[validatorId],
          ownStake,
          totalStake: total,
          nominatorsStakes: allStakes.get(validatorId) || [],
        };
      });

      allCommissions.forEach(({ validatorId, commission }) => {
        perValidatorData[validatorId] = {
          ...perValidatorData[validatorId],
          commission,
        };
      });

      return {
        perValidator: perValidatorData,
        totalEraRewardPoints,
        totalAwardedRewardPoints: allAwardedRewardPoints.total,
      };
    }
  );
};
