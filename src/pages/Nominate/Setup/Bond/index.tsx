// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { useTxMeta } from 'contexts/TxMeta';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import type { SetupStepProps } from 'library/SetupSteps/types';

export const Bond = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useConnect();
  const { txFees } = useTxMeta();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress('nominator', activeAccount);
  const { progress } = setup;

  // either free to bond or existing setup value
  const initialBondValue = progress.bond === '0' ? '0' : progress.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState<{ bond: string }>({
    bond: initialBondValue,
  });

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // handler for updating bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup('nominator', value);
  };

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: initialBondValue,
    });
  }, [activeAccount]);

  // apply initial bond value to setup progress
  useEffect(() => {
    // only update if Bond is currently active
    if (setup.section === section) {
      setActiveAccountSetup('nominator', {
        ...progress,
        bond: initialBondValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.bond !== '0' && progress.bond !== ''}
        title={t('nominate.bond')}
        helpKey="Bonding"
        bondFor="nominator"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <BondFeedback
          syncing={txFees.isZero()}
          bondFor="nominator"
          inSetup
          listenIsValid={(valid) => setBondValid(valid)}
          defaultBond={initialBondValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: progress,
            },
            {
              set: setBond,
              current: bond,
            },
          ]}
          txFees={txFees}
          maxWidth
        />
        <Footer complete={bondValid} bondFor="nominator" />
      </MotionContainer>
    </>
  );
};
