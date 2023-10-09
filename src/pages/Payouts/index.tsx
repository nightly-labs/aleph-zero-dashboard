// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, PageRow, PageTitle } from '@polkadot-cloud/react';
import { MaxPayoutDays } from 'consts';
import { useHelp } from 'contexts/Help';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { formatSize } from 'library/Graphs/Utils';
import usePayouts from 'library/Hooks/usePayouts';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { useSize } from 'library/Hooks/useSize';
import { StatBoxList } from 'library/StatBoxList';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { StatusLabel } from 'library/StatusLabel';
import { Spinner } from 'library/Headers/Spinner';
import type { PageProps } from 'types';
import { PayoutList } from './PayoutList';
import { LastEraPayoutStat } from './Stats/LastEraPayout';

const AVERAGE_WINDOW_SIZE = 10;
export const Payouts = ({ page }: PageProps) => {
  const { t } = useTranslation();
  const { openHelp } = useHelp();

  const { key } = page;

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 280);

  const { loading, payouts, hasAnyPayouts } = usePayouts(
    MaxPayoutDays + AVERAGE_WINDOW_SIZE
  );

  const { fromEra, toEra } = useMemo(
    () => calcErasRange(payouts.map(([era]) => era)),
    [payouts]
  );

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <StatBoxList>
        <LastEraPayoutStat />
      </StatBoxList>
      <PageRow>
        <CardWrapper>
          <CardHeaderWrapper>
            <h4>
              {t('payouts.payoutHistory', { ns: 'pages' })}
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Payout History')}
              />
            </h4>
            <h2>
              {fromEra && toEra ? (
                <>
                  {fromEra}
                  {fromEra !== toEra && <>&nbsp;-&nbsp;{toEra}</>}
                </>
              ) : (
                t('payouts.none', { ns: 'pages' })
              )}
            </h2>
          </CardHeaderWrapper>
          <div className="inner" ref={ref} style={{ minHeight }}>
            {!loading && !hasAnyPayouts && (
              <StatusLabel
                status="sync_or_setup"
                title={t('payouts.notStaking', { ns: 'pages' })}
                topOffset="30%"
              />
            )}
            {loading && <LoadingIndicator />}
            <GraphWrapper
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
                opacity: hasAnyPayouts && !loading ? 1 : 0.75,
                transition: 'opacity 0.5s',
              }}
            >
              <PayoutBar
                payouts={payouts.slice(AVERAGE_WINDOW_SIZE)}
                height="165px"
              />
              <PayoutLine
                payouts={payouts}
                averageWindowSize={AVERAGE_WINDOW_SIZE}
                height="65px"
              />
            </GraphWrapper>
          </div>
        </CardWrapper>
      </PageRow>
      {payouts && hasAnyPayouts ? (
        <PageRow>
          <CardWrapper>
            <PayoutList
              title={t('payouts.recentPayouts', { ns: 'pages' })}
              payouts={payouts}
              pagination
            />
          </CardWrapper>
        </PageRow>
      ) : (
        <></>
      )}
    </>
  );
};

const calcErasRange = (allEras: number[]) =>
  allEras.reduce(
    (acc, era) => {
      if (era < acc.fromEra) return { ...acc, fromEra: era };
      if (era > acc.toEra) return { ...acc, toEra: era };
      return acc;
    },
    { fromEra: allEras[0], toEra: allEras[0] }
  );

const LoadingIndicator = styled(Spinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 2;
`;
