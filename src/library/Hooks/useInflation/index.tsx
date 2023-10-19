// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';

const BIGNUMBER_THOUSAND = new BigNumber(1_000);
const BIGNUMBER_MILLION = new BigNumber(1_000_000);
const BIGNUMBER_BILLION = new BigNumber(1_000_000_000);

export const useInflation = () => {
  const { network } = useApi();
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();
  const { params } = network;
  const { lastTotalStake } = staking;
  const { totalIssuance, auctionCounter } = metrics;

  const {
    auctionAdjust,
    auctionMax,
    maxInflation,
    stakeTarget,
    yearlyInflationInTokens,
  } = params;

  /* For Aleph Zero inflation is calculated based on yearlyInflationInTokens and totalIssuanceInTokens
   * We multiply stakedReturn by 0.9, as in case of Aleph Zero chain 10% of return goes to treasury
   */

  const calculateInflation = (
    totalStaked: BigNumber,
    numAuctions: BigNumber
  ) => {
    const stakedFraction =
      totalStaked.isZero() || totalIssuance.isZero()
        ? 0
        : totalStaked
            .multipliedBy(BIGNUMBER_MILLION)
            .dividedBy(totalIssuance)
            .toNumber() / BIGNUMBER_MILLION.toNumber();
    const idealStake =
      stakeTarget -
      Math.min(auctionMax, numAuctions.toNumber()) * auctionAdjust;
    const idealInterest = maxInflation / idealStake;

    const totalIssuanceInTokens = totalIssuance
      .div(BIGNUMBER_BILLION)
      .div(BIGNUMBER_THOUSAND);

    const inflation = totalIssuanceInTokens.isZero()
      ? 0
      : 100 * (yearlyInflationInTokens / totalIssuanceInTokens.toNumber());

    let stakedReturn = stakedFraction ? inflation / stakedFraction : 0;
    stakedReturn *= 0.9;

    return {
      idealInterest,
      idealStake,
      inflation,
      stakedFraction,
      stakedReturn,
    };
  };

  return calculateInflation(lastTotalStake, auctionCounter);
};
