// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import { stringToU8a } from '@polkadot/util';

import type { NetworkName } from 'types';
import BigNumber from 'bignumber.js';
import { NetworkList } from 'config/networks';
import type { APIConstants, APIContextInterface } from 'contexts/Api/types';

/**
 * Checking values of "NETWORKS" instead of "NetworkName", because they're not
 * compatible between runtime (the former) and compile time (the latter), the former
 * having less fields defined and being the only safe one to use. This is obviously
 * a wrong types problem, but fixing these types requires a bigger refactor.
 */
const isValidConfiguredNetworkName = (value: unknown): value is NetworkName =>
  Object.keys(NetworkList).includes(value as string);

const isNetworkNameValidConfig = (value: NetworkName) =>
  Object.keys(NetworkList).includes(value);

export const defaultNetworkName: NetworkName =
  import.meta.env.NODE_ENV === 'production' &&
  isNetworkNameValidConfig('Aleph Zero')
    ? 'Aleph Zero'
    : isNetworkNameValidConfig('Aleph Zero Testnet')
    ? 'Aleph Zero Testnet'
    : isNetworkNameValidConfig('Aleph Zero Devnet')
    ? 'Aleph Zero Devnet'
    : 'Aleph Zero Local';

const cachedNetworkName = localStorage.getItem('network');

if (!isValidConfiguredNetworkName(cachedNetworkName)) {
  localStorage.setItem('network', defaultNetworkName);
}

export const consts: APIConstants = {
  bondDuration: new BigNumber(0),
  maxNominations: new BigNumber(0),
  sessionsPerEra: new BigNumber(0),
  maxNominatorRewardedPerValidator: new BigNumber(0),
  historyDepth: new BigNumber(0),
  maxElectingVoters: new BigNumber(0),
  expectedBlockTime: new BigNumber(0),
  expectedEraTime: new BigNumber(0),
  epochDuration: new BigNumber(0),
  existentialDeposit: new BigNumber(0),
  fastUnstakeDeposit: new BigNumber(0),
  poolsPalletId: stringToU8a('0'),
};

export const defaultApiContext: APIContextInterface = {
  switchNetwork: async (n, lc) => {
    await new Promise((resolve) => resolve(null));
  },
  api: null,
  consts,
  chainState: undefined,
  isLightClient: false,
  isReady: false,
  apiStatus: 'disconnected',
  network: NetworkList[defaultNetworkName],
};
