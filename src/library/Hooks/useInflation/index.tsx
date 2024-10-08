// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useEffect, useState } from 'react';

const calculateInflation = (
  totalStaked: BigNumber,
  totalIssuance: BigNumber,
  yearlyInflationInPercentage: number
) => {
  const stakedFraction =
    totalStaked.isZero() || totalIssuance.isZero()
      ? 0
      : totalStaked.dividedBy(totalIssuance).toNumber();

  const baseStakedReturn =
    stakedFraction !== 0 ? yearlyInflationInPercentage / stakedFraction : 0;
  /* For Aleph Zero inflation is calculated based on yearlyInflationInTokens and totalIssuanceInTokens
   * We multiply stakedReturn by 0.9, as in case of Aleph Zero chain 10% of return goes to treasury
   */
  const stakedReturn = baseStakedReturn * 0.9;

  return {
    inflation: yearlyInflationInPercentage,
    stakedFraction,
    stakedReturn,
  };
};

const useYearlyInflation = () => {
  const { api } = useApi();
  const [yearlyInflation, setYearlyInflation] = useState<number>();

  const getYearlyInflation = api?.call?.alephSessionApi?.yearlyInflation;

  useEffect(() => {
    getYearlyInflation?.()
      .then((val) => setYearlyInflation(val.toNumber() / 1_000_000_000))
      // eslint-disable-next-line no-console
      .catch(console.error);
    // `api` object can change in case of network change which should trigger refetch.
  }, [api]);

  return yearlyInflation;
};

export const useInflation = () => {
  const {
    metrics: { totalIssuance },
  } = useNetworkMetrics();
  const {
    staking: { lastTotalStake },
  } = useStaking();
  const yearlyInflation = useYearlyInflation();

  return calculateInflation(
    lastTotalStake,
    totalIssuance,
    (yearlyInflation ?? 0) * 100
  );
};
