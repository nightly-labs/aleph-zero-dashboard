// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FunctionComponent, SVGProps } from 'react';
import { ReactComponent as SignerSvg } from '../../img/a0_icon_extension.svg';
import { ReactComponent as NovaWalletSVG } from './icons/nova_wallet.svg';
import { ReactComponent as PolkadotJSSVG } from './icons/polkadot_js.svg';
import { ReactComponent as SubwalletSVG } from './icons/subwallet_icon.svg';
import { ReactComponent as TalismanSVG } from './icons/talisman_icon.svg';
import { ReactComponent as NightlySvg } from './icons/nightly_icon.svg';

export interface ExtensionConfig {
  id: string;
  title: string;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  website: string;
}
export const ExtensionsArray: ExtensionConfig[] = [
  {
    id: 'aleph-zero-signer',
    title: 'Aleph Zero Signer',
    icon: SignerSvg,
    website: 'alephzero.org/signer',
  },
  {
    id: 'Nightly',
    title: 'Nightly',
    icon: NightlySvg,
    website: 'nightly.app/download',
  },
  {
    id: 'polkadot-js',
    title: (window as any)?.walletExtension?.isNovaWallet
      ? 'Nova Wallet'
      : 'Polkadot JS',
    icon: (window as any)?.walletExtension?.isNovaWallet
      ? NovaWalletSVG
      : PolkadotJSSVG,
    website: window?.walletExtension?.isNovaWallet
      ? 'novawallet.io'
      : 'polkadot.js.org/extension',
  },
  {
    id: 'subwallet-js',
    title: 'SubWallet',
    icon: SubwalletSVG,
    website: 'subwallet.app',
  },
  {
    id: 'talisman',
    title: 'Talisman',
    icon: TalismanSVG,
    website: 'talisman.xyz',
  },
];

export const Extensions = Object.fromEntries(
  ExtensionsArray.map(({ id, ...rest }) => [id, rest])
);
