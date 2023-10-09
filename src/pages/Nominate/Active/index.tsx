// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ButtonHelp,
  PageRow,
  PageTitle,
  RowSection,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { GenerateNominations } from 'library/GenerateNominations';
import { StatBoxList } from 'library/StatBoxList';
import { ControllerNotStash } from './ControllerNotStash';
import { ManageBond } from './ManageBond';
import { Nominations } from './Nominations';
import { MinimumActiveStakeStat } from './Stats/MinimumActiveStake';
import { MinimumNominatorBondStat } from './Stats/MinimumNominatorBond';
import { Status } from './Status';
import { UnstakePrompts } from './UnstakePrompts';

export const Active = () => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useConnect();
  const { isSyncing } = useUi();
  const { targets, setTargets, inSetup } = useStaking();
  const { getAccountNominations } = useBonded();
  const nominations = getAccountNominations(activeAccount);
  const { openHelp } = useHelp();

  const ROW_HEIGHT = 220;

  return (
    <>
      <PageTitle title={t('nominate.nominate')} />
      <StatBoxList>
        <MinimumNominatorBondStat />
        <MinimumActiveStakeStat />
      </StatBoxList>
      <ControllerNotStash />
      <UnstakePrompts />
      <PageRow>
        <RowSection hLast>
          <Status height={ROW_HEIGHT} />
        </RowSection>
        <RowSection secondary>
          <CardWrapper height={ROW_HEIGHT}>
            <ManageBond />
          </CardWrapper>
        </RowSection>
      </PageRow>
      <PageRow>
        <CardWrapper>
          {nominations.length || inSetup() || isSyncing ? (
            <Nominations bondFor="nominator" nominator={activeAccount} />
          ) : (
            <>
              <CardHeaderWrapper $withAction>
                <h3>
                  {t('nominate.nominate')}
                  <ButtonHelp
                    marginLeft
                    onClick={() => openHelp('Nominations')}
                  />
                </h3>
              </CardHeaderWrapper>
              <GenerateNominations
                batchKey="generate_nominations_active"
                setters={[
                  {
                    set: setTargets,
                    current: targets,
                  },
                ]}
                nominations={targets.nominations}
              />
            </>
          )}
        </CardWrapper>
      </PageRow>
    </>
  );
};
