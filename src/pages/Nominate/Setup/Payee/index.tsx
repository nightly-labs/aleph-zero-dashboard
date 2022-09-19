// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { isNumeric } from 'Utils';
import { useUi } from 'contexts/UI';
import { useConnect } from 'contexts/Connect';
import { SetupStepProps } from 'library/SetupSteps/types';
import { SetupType } from 'contexts/UI/types';
import { Header } from 'library/SetupSteps/Header';
import { Footer } from 'library/SetupSteps/Footer';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { Spacer } from '../../Wrappers';
import { Items, Item } from './Wrappers';

export const Payee = (props: SetupStepProps) => {
  const { section } = props;

  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(SetupType.Stake, activeAccount);

  const options = ['Staked', 'Stash', 'Controller'];
  const buttons = [
    {
      title: 'Back to Staking',
      subtitle:
        'Payouts are automatically bonded to your existing bonded balance.',
      index: 0,
    },
    {
      title: 'To Stash',
      subtitle: 'Payouts will be sent to your stash account as free balance.',
      index: 1,
    },
    {
      title: 'To Controller',
      subtitle:
        'Payouts will be sent to your controller account as free balance.',
      index: 2,
    },
  ];

  const [payee, setPayee]: any = useState(setup.payee);

  // update selected value on account switch
  useEffect(() => {
    setPayee(setup.payee);
  }, [activeAccount]);

  const handleChangePayee = (i: number) => {
    // not in options
    if (!isNumeric(i)) {
      return;
    }
    if (i >= options.length) {
      return;
    }

    // set local value to update input element
    setPayee(options[i]);
    // set setup payee
    setActiveAccountSetup(SetupType.Stake, {
      ...setup,
      payee: options[i],
    });
  };

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.payee !== null}
        title="Reward Destination"
        helpKey="Reward Destination"
        setupType={SetupType.Stake}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Spacer />
        <Items>
          {buttons.map((item: any, index: number) => {
            return (
              <Item
                key={`payee_option_${index}`}
                selected={payee === options[item.index]}
                onClick={() => handleChangePayee(item.index)}
              >
                <h3>{item.title}</h3>
                <div>
                  <p>{item.subtitle}</p>
                </div>
              </Item>
            );
          })}
        </Items>
        <Footer complete={setup.payee !== null} setupType={SetupType.Stake} />
      </MotionContainer>
    </>
  );
};

export default Payee;
