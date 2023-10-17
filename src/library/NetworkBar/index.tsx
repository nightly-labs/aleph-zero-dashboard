// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { usePlugins } from 'contexts/Plugins';
import { usePrices } from 'library/Hooks/usePrices';
import { Status } from './Status';
import { Summary, Wrapper } from './Wrappers';

export const NetworkBar = () => {
  const { t } = useTranslation('library');
  const { plugins } = usePlugins();
  const { network, isLightClient } = useApi();
  const prices = usePrices();

  const ORGANISATION = import.meta.env.VITE_ORGANISATION;
  const TERMS_OF_USE = import.meta.env.VITE_TERMS_OF_USE;

  const [networkName, setNetworkName] = useState<string>(
    capitalizeFirstLetter(network.name)
  );

  useEffect(() => {
    setNetworkName(
      `${capitalizeFirstLetter(network.name)}${isLightClient ? ` Light` : ``}`
    );
  }, [network.name, isLightClient]);

  return (
    <Wrapper>
      <network.brand.icon className="network_icon" />
      <Summary>
        <section>
          <p>{ORGANISATION === undefined ? networkName : ORGANISATION}</p>
          <Status />
          <p>
            <a href={TERMS_OF_USE} target="_blank" rel="noreferrer">
              {t('termsOfUse')}
            </a>
          </p>
        </section>
        <section>
          <div className="hide-small">
            {plugins.includes('binance_spot') && (
              <>
                <div className="stat">
                  <span
                    className={`change${
                      prices.change < 0
                        ? ' neg'
                        : prices.change > 0
                        ? ' pos'
                        : ''
                    }`}
                  >
                    {prices.change < 0 ? '' : prices.change > 0 ? '+' : ''}
                    {prices.change}%
                  </span>
                </div>
                <div className="stat">
                  1 {network.api.unit} / {prices.lastPrice} USD
                </div>
              </>
            )}
          </div>
        </section>
      </Summary>
    </Wrapper>
  );
};
