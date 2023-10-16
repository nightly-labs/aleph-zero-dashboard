// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LedgerApp } from 'contexts/Hardware/types';
import { ReactComponent as KusamaSVG } from 'img/appIcons/kusama.svg';
import { ReactComponent as PolkadotSVG } from 'img/appIcons/polkadot.svg';
import { ReactComponent as AlephZeroSVG } from 'img/a0_icon.svg';

const alephZeroOptions = {
  appName: 'AlephZero',
  Icon: AlephZeroSVG,
};

export const LedgerApps: LedgerApp[] = [
  {
    network: 'polkadot',
    appName: 'Polkadot',
    Icon: PolkadotSVG,
  },
  {
    network: 'kusama',
    appName: 'Kusama',
    Icon: KusamaSVG,
  },
  ...(
    [
      'Aleph Zero',
      'Aleph Zero Testnet',
      'Aleph Zero Devnet',
      'Aleph Zero Local',
      'Aleph Zero Custom',
    ] as const
  ).map((network) => ({ ...alephZeroOptions, network })),
];
