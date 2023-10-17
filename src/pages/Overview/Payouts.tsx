// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxPayoutDays } from 'consts';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { useSize } from 'library/Hooks/useSize';
import { formatSize } from 'library/Graphs/Utils';
import { Spinner } from 'library/Headers/Spinner';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import usePayouts from 'library/Hooks/usePayouts';
import { StatusLabel } from 'library/StatusLabel';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AVERAGE_WINDOW_SIZE = 10;

export const Payouts = () => {
  const { t } = useTranslation('pages');

  const { network } = useApi();
  const { payouts, loading, hasAnyPayouts } = usePayouts(
    MaxPayoutDays + AVERAGE_WINDOW_SIZE
  );
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();

  const ref = React.useRef<HTMLDivElement>(null);

  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 260);

  const [lastRewardEra, lastRewardValue] = payouts?.[payouts.length - 1] || [];

  return (
    <>
      <div className="head">
        <h4>{t('overview.recentPayouts')}</h4>
        <h2>
          {lastRewardValue ?? 0}
          &nbsp;{network.unit}
          &nbsp;
          <span className="fiat">
            {lastRewardEra ? `Era ${lastRewardEra}` : ''}
          </span>
        </h2>
      </div>
      <div className="inner" ref={ref} style={{ minHeight }}>
        {!loading && !hasAnyPayouts && (
          <StatusLabel
            status="sync_or_setup"
            title={t('overview.notStaking')}
            topOffset="37%"
          />
        )}
        {loading && <LoadingIndicator />}
        <GraphWrapper
          style={{
            height: `${height}px`,
            width: `${width}px`,
            position: 'absolute',
            opacity: notStaking ? 0.75 : 1,
            transition: 'opacity 0.5s',
          }}
        >
          <PayoutBar payouts={payouts.slice(-MaxPayoutDays)} height="150px" />
          <div style={{ marginTop: '3rem' }}>
            <PayoutLine
              payouts={payouts}
              averageWindowSize={AVERAGE_WINDOW_SIZE}
              maxPayoutDays={MaxPayoutDays}
              height="65px"
            />
          </div>
        </GraphWrapper>
      </div>
    </>
  );
};

const LoadingIndicator = styled(Spinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 2;
`;
