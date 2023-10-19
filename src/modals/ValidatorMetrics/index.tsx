// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, ModalPadding, PolkadotIcon } from '@polkadot-cloud/react';
import { ellipsisFn, planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { Title } from 'library/Modal/Title';
import {
  StatWrapper,
  ValidatorMetricsStatsWrapper,
} from 'library/Modal/Wrappers';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useTheme } from 'contexts/Themes';

export const ValidatorMetrics = () => {
  const { t } = useTranslation('modals');
  const {
    network: { units, unit },
  } = useApi();
  const { options } = useOverlay().modal.config;
  const { address, identity } = options;
  const {
    eraStakers: { stakers },
  } = useStaking();
  const { openHelp } = useHelp();
  const { mode } = useTheme();

  // is the validator in the active era
  const validatorInEra = stakers.find((s) => s.address === address) || null;

  let validatorOwnStake = new BigNumber(0);
  let otherStake = new BigNumber(0);
  if (validatorInEra) {
    const { others, own } = validatorInEra;

    others.forEach(({ value }) => {
      otherStake = otherStake.plus(value);
    });
    if (own) {
      validatorOwnStake = new BigNumber(own);
    }
  }

  const stats = [
    {
      label: t('selfStake'),
      value: `${planckToUnit(validatorOwnStake, units).toFormat()} ${unit}`,
      help: 'Self Stake',
    },
    {
      label: t('nominatorStake'),
      value: `${planckToUnit(otherStake, units).toFormat()} ${unit}`,
      help: 'Nominator Stake',
    },
  ];

  return (
    <>
      <Title title={t('validatorMetrics')} />
      <div className="header">
        <PolkadotIcon
          dark={mode === 'dark'}
          nocopy
          address={address}
          size={33}
        />
        <h2>
          &nbsp;&nbsp;
          {identity === null ? ellipsisFn(address) : identity}
        </h2>
      </div>

      <ModalPadding horizontalOnly>
        <ValidatorMetricsStatsWrapper>
          {stats.map((s, i) => (
            <StatWrapper key={`metrics_stat_${i}`}>
              <div className="inner">
                <h4>
                  {s.label}{' '}
                  <ButtonHelp marginLeft onClick={() => openHelp(s.help)} />
                </h4>
                <h2>{s.value}</h2>
              </div>
            </StatWrapper>
          ))}
        </ValidatorMetricsStatsWrapper>
      </ModalPadding>
    </>
  );
};
