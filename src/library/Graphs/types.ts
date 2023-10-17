// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';

export interface BondedProps {
  active: BigNumber;
  free: BigNumber;
  unlocking: BigNumber;
  unlocked: BigNumber;
  inactive: boolean;
}

export interface PayoutBarProps {
  payouts: [number, number][];
  height: string;
}

export interface PayoutLineProps {
  payouts: [number, number][];
  averageWindowSize: number;
  maxPayoutDays: number;
  height: string;
  background?: string;
}

export interface StatPieProps {
  value: number;
  value2: number;
}

export interface CardHeaderWrapperProps {
  $withAction?: boolean;
}

export interface CardWrapperProps {
  height?: string | number;
}

export interface PayoutDayCursor {
  amount: BigNumber;
  event_id: string;
}
