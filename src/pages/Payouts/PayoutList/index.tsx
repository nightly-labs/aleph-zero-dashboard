// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { StakingContext } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import React from 'react';
import { ItemWrapper } from '../Wrappers';
import type { PayoutListProps } from '../types';
import { PayoutListProvider, usePayoutList } from './context';

export const PayoutListInner = ({
  allowMoreCols,
  title,
  payouts,
}: PayoutListProps) => {
  const { mode } = useTheme();
  const {
    network: { colors },
  } = useApi();
  const { listFormat, setListFormat } = usePayoutList();

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>{title}</h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={listFormat === 'row' ? colors.primary[mode] : 'inherit'}
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={listFormat === 'col' ? colors.primary[mode] : 'inherit'}
            />
          </button>
        </div>
      </Header>
      <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        <MotionContainer>
          {payouts
            .slice()
            .reverse()
            .filter(([, payout]) => payout)
            .map(([eraIndex, payout], index) => {
              return (
                <motion.div
                  className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                  key={`nomination_${index}`}
                  variants={{
                    hidden: {
                      y: 15,
                      opacity: 0,
                    },
                    show: {
                      y: 0,
                      opacity: 1,
                    },
                  }}
                >
                  <ItemWrapper>
                    <div className="inner">
                      <div className="row">
                        <div>
                          <div>
                            <h4 className="reward">{payout}</h4>
                          </div>
                          <div>
                            <h5>Era: {eraIndex}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ItemWrapper>
                </motion.div>
              );
            })}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const PayoutList = (props: PayoutListProps) => (
  <PayoutListProvider>
    <PayoutListShouldUpdate {...props} />
  </PayoutListProvider>
);

export class PayoutListShouldUpdate extends React.Component<PayoutListProps> {
  static contextType = StakingContext;

  render() {
    return <PayoutListInner {...this.props} />;
  }
}
