// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { planckBnToUnit, humanNumber } from 'Utils';
import BondedGraph from 'library/Graphs/Bonded';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { Button, ButtonRow } from 'library/Button';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { TransferOptions } from 'contexts/Balances/types';
import BN from 'bn.js';
import { useActivePool } from 'contexts/Pools/ActivePool';

export const ManageBond = () => {
  const { network } = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { getLedgerForStash, getTransferOptions } = useBalances();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const ledger = getLedgerForStash(activeAccount);
  const { active }: { active: BN } = ledger;
  const { getPoolTransferOptions } = useActivePool();
  const { active: activePool } = getPoolTransferOptions(activeAccount);

  const {
    freeBalance,
    totalUnlocking,
    totalUnlocked,
    totalUnlockChuncks,
  }: TransferOptions = getTransferOptions(activeAccount);

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          Bonded Funds
          <OpenAssistantIcon page="stake" title="Bonding" />
        </h4>
        <h2>
          {humanNumber(planckBnToUnit(active, units))}&nbsp;{network.unit}
        </h2>
        <ButtonRow>
          <Button
            small
            primary
            inline
            title="+"
            disabled={
              inSetup() || isSyncing || isReadOnlyAccount(activeAccount)
            }
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'add', bondType: 'stake' },
                'small'
              )
            }
          />
          <Button
            small
            primary
            title="-"
            disabled={
              inSetup() || isSyncing || isReadOnlyAccount(activeAccount)
            }
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'remove', bondType: 'stake' },
                'small'
              )
            }
          />
          <Button
            small
            inline
            primary
            icon={faLockOpen}
            title={String(totalUnlockChuncks ?? 0)}
            disabled={
              inSetup() || isSyncing || isReadOnlyAccount(activeAccount)
            }
            onClick={() =>
              openModalWith('UnlockChunks', { bondType: 'stake' }, 'small')
            }
          />
        </ButtonRow>
      </CardHeaderWrapper>
      <BondedGraph
        active={planckBnToUnit(active, units)}
        unlocking={planckBnToUnit(totalUnlocking, units)}
        unlocked={planckBnToUnit(totalUnlocked, units)}
        free={planckBnToUnit(freeBalance.sub(activePool), units)}
        inactive={inSetup()}
      />
    </>
  );
};

export default ManageBond;