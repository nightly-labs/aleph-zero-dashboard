// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface PayoutListProps {
  allowMoreCols?: boolean;
  pagination?: boolean;
  disableThrottle?: boolean;
  title?: string | null;
  payouts: [number, number][];
}
