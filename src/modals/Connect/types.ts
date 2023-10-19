// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionConfig } from 'config/extensions';

export interface ExtensionProps {
  meta: ExtensionConfig;
  installed?: any;
  size?: string;
  message?: string;
  flag?: boolean;
  status?: string;
}

export interface ListWithInputProps {
  setInputOpen: (k: boolean) => void;
  inputOpen: boolean;
}

export interface forwardRefProps {
  setSection?: any;
  readOnlyOpen: boolean;
  setReadOnlyOpen: (e: boolean) => void;
}
