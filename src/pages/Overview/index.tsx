// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  PageHeading,
  PageRow,
  PageTitle,
  RowSection,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { CardWrapper } from 'library/Card/Wrappers';
import { ControllerNotStash } from 'pages/Nominate/Active/ControllerNotStash';
import { ActiveAccounts } from './ActiveAccounts';
import { BalanceChart } from './BalanceChart';
import { BalanceLinks } from './BalanceLinks';
import { NetworkStats } from './NetworkSats';
import { Payouts } from './Payouts';
import { StakeStatus } from './StakeStatus';
import PayoutsErrorBoundary from './PayoutsErrorBoundary';

export const Overview = () => {
  const { t } = useTranslation('pages');

  const PAYOUTS_HEIGHT = 380;

  return (
    <>
      <PageTitle title={t('overview.overview')} />
      <PageRow>
        <PageHeading>
          <ActiveAccounts />
        </PageHeading>
      </PageRow>
      <ControllerNotStash />
      <PageRow>
        <StakeStatus />
      </PageRow>
      <PageRow>
        <RowSection secondary>
          <CardWrapper height={PAYOUTS_HEIGHT}>
            <BalanceChart />
            <BalanceLinks />
          </CardWrapper>
        </RowSection>
        <RowSection hLast vLast>
          <CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }}>
            <PayoutsErrorBoundary>
              <Payouts />
            </PayoutsErrorBoundary>
          </CardWrapper>
        </RowSection>
      </PageRow>
      <PageRow>
        <NetworkStats />
      </PageRow>
    </>
  );
};
