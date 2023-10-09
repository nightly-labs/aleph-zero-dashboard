// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';

export const ActiveValidatorsStat = () => {
  const { t } = useTranslation('pages');
  const {
    eraStakers: { activeValidators },
  } = useStaking();

  const params = {
    label: t('validators.activeValidators'),
    stat: {
      value: activeValidators,
      unit: '',
    },
    graph: {
      value1: activeValidators,
      value2: 0,
    },
    tooltip: '100%',
    helpKey: 'Active Validator',
  };

  return <Pie {...params} />;
};
