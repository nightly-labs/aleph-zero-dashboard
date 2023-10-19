// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { shuffle } from '@polkadot-cloud/utils';
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import type { Validator } from 'contexts/Validators/types';
import { useValidatorFilters } from 'library/Hooks/useValidatorFilters';

export const useFetchMehods = () => {
  const { validators } = useValidators();
  const { applyFilter } = useValidatorFilters();
  const { favoritesList } = useFavoriteValidators();

  const fetch = (method: string) => {
    let nominations: any[];
    switch (method) {
      case 'Display All':
        nominations = fetchAll();
        break;
      case 'From Favorites':
        nominations = fetchFavorites();
        break;
      case 'Random Validator':
        nominations = addRandomValidator();
        break;
      default:
        nominations = [];
    }
    return nominations;
  };

  const fetchFavorites = () => {
    let favs: Validator[] = [];

    if (favoritesList?.length) {
      favs = favoritesList;
    }
    return favs;
  };

  const fetchAll = () => {
    return validators;
  };

  const addRandomValidator = () => {
    let nominations = Object.assign(validators);

    nominations = applyFilter(
      null,
      ['all_commission', 'blockedall', 'missing_identity'],
      nominations
    );

    // take one validator
    const validator = shuffle(nominations).slice(0, 1)[0] || null;

    if (validator) {
      return [validator];
    }
    return [];
  };

  return { fetch };
};
