// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { ModalCustomHeader, ModalPadding } from '@polkadot-cloud/react';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useConnect } from 'contexts/Connect';
import { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectorButton } from './SelectorButton';
import { ReactComponent as NightlySvg } from 'config/extensions/icons/nightly_icon.svg';
import { ReactComponent as AlephZeroSVG } from 'img/a0_icon.svg';

import { SelectorButtonSeparator, SelectorMarginTop } from './Wrappers';
import { useHelp } from 'contexts/Help';
import { getNCAdapter } from 'contexts/Connect/NCAdapter';
import { useNotifications } from 'contexts/Notifications';

export const ChooseSelector = () => {
  const { t } = useTranslation('modals');
  const { accounts, addToAccounts, connectToAccount, setSelector } =
    useConnect();
  const { replaceModal, setModalStatus } = useOverlay().modal;
  const [adapter, setAdapter] = useState<NightlyConnectAdapter>();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const initAdapter = async () => {
      const adapter = await getNCAdapter();
      setAdapter(adapter);
    };

    initAdapter();
  }, []);

  return (
    <ModalPadding>
      <ModalCustomHeader>
        <div className="first">
          <h1>{t('chooseSelector')}</h1>
        </div>
      </ModalCustomHeader>
      <SelectorMarginTop />
      <React.Fragment>
        <SelectorButtonSeparator />
        <SelectorButton
          label="Nightly Connect"
          Icon={NightlySvg}
          onClick={() => {
            adapter?.connect().then(async () => {
              const accounts = await adapter.accounts.get();
              addToAccounts(accounts as ImportedAccount[]);
              connectToAccount(accounts[0] as ImportedAccount);
              setSelector('nightlyConnect');
              setModalStatus('closing');
              addNotification({
                title: t('extensionConnected'),
                subtitle: `${t('titleExtensionConnected', {
                  title: '',
                })}`,
              });
            });
          }}
        />
      </React.Fragment>
      <React.Fragment>
        <SelectorButtonSeparator />
        <SelectorButton
          label="Native"
          Icon={AlephZeroSVG}
          onClick={() => {
            replaceModal({ key: accounts.length ? 'Accounts' : 'Connect' });
          }}
        />
      </React.Fragment>
    </ModalPadding>
  );
};
