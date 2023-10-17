// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useApi } from 'contexts/Api';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { useMemo } from 'react';
import { graphColors } from 'styles/graphs';

import { round } from 'Utils';
import type { PayoutLineProps } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutLine = ({
  payouts,
  averageWindowSize,
  maxPayoutDays,
  height,
  background,
}: PayoutLineProps) => {
  const graphablePayouts = payouts.slice(-maxPayoutDays); // Take only values included in latest maxPayoutDays.
  const { mode } = useTheme();
  const { unit, units, colors } = useApi().network;
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { membership: poolMembership } = usePoolMemberships();
  const averageValues = useMemo(
    () =>
      payouts
        .map(([, payout]) => payout)
        .reduce<number[]>((acc, eraPayout, i, allPayouts) => {
          const previousAvg = acc[i - 1] ?? 0;
          const previousDivider = Math.min(acc.length, averageWindowSize);
          const previousSum = previousAvg * previousDivider;

          const excludedPayout = allPayouts[i - averageWindowSize] ?? 0;
          const sum = eraPayout + previousSum - excludedPayout;
          const avg = sum / Math.min(acc.length + 1, averageWindowSize);

          return [...acc, avg];
        }, [])
        .map((avgPayout) => round(avgPayout, 2))
        .slice(-maxPayoutDays),
    [payouts]
  );

  const notStaking = !isSyncing && inSetup() && !poolMembership;
  const poolingOnly = !isSyncing && inSetup() && poolMembership !== null;

  // determine color for payouts
  const color = notStaking
    ? colors.primary[mode]
    : !poolingOnly
    ? colors.primary[mode]
    : colors.secondary[mode];

  // configure graph options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 30,
          autoSkip: true,
        },
      },
      y: {
        ticks: {
          display: false,
          beginAtZero: false,
        },
        border: {
          display: false,
        },
        grid: {
          color: graphColors.grid[mode],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: graphColors.tooltip[mode],
        titleColor: graphColors.label[mode],
        bodyColor: graphColors.label[mode],
        bodyFont: {
          weight: '600',
        },
        callbacks: {
          title: () => [],
          label: (context: any) =>
            ` ${new BigNumber(context.parsed.y)
              .decimalPlaces(units)
              .toFormat()} ${unit}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  };

  const data = {
    labels: graphablePayouts.map(([era]) => era),
    datasets: [
      {
        label: 'Payout',
        data: averageValues,
        borderColor: color,
        backgroundColor: color,
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2.3,
      },
    ],
  };

  return (
    <>
      <h5 className="secondary">
        {averageWindowSize > 1 ? `${averageWindowSize} Day Average` : null}
      </h5>
      <div
        style={{
          height: height || 'auto',
          background: background || 'none',
          marginTop: '0.6rem',
          padding: '0 0 0.5rem 1.5rem',
        }}
      >
        <Line options={options} data={data} />
      </div>
    </>
  );
};
