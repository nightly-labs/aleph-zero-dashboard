// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { GenerateNominations } from '../GenerateNominations';
import type { NominationsProps } from './types';

export const Nominate = ({ batchKey, bondFor, section }: NominationsProps) => {
  const { t } = useTranslation('library');
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress(bondFor, activeAccount);
  const { progress } = setup;

  const setterFn = () => getSetupProgress(bondFor, activeAccount).progress;

  // handler for updating setup.bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup(bondFor, value);
  };

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.nominations.length > 0}
        title={t('nominate')}
        helpKey="Nominating"
        bondFor={bondFor}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <h4>Choose a validator to nominate.</h4>
        <GenerateNominations
          stepsSetup
          batchKey={batchKey}
          setters={[
            {
              current: {
                callable: true,
                fn: setterFn,
              },
              set: handleSetupUpdate,
            },
          ]}
          nominations={progress.nominations}
        />

        <Footer complete={progress.nominations.length > 0} bondFor={bondFor} />
      </MotionContainer>
    </>
  );
};
