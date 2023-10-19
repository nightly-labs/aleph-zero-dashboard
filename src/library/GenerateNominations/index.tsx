// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronCircleRight,
  faHeart,
  faTimes,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { camelize } from '@polkadot-cloud/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { SelectableWrapper } from 'library/List';
import { SelectItems } from 'library/SelectItems';
import { SelectItem } from 'library/SelectItems/Item';
import { ValidatorList } from 'library/ValidatorList';
import { Wrapper } from 'pages/Overview/NetworkSats/Wrappers';
import { useStaking } from 'contexts/Staking';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import type {
  GenerateNominationsInnerProps,
  Nominations,
} from '../SetupSteps/types';
import { useFetchMehods } from './useFetchMethods';

export const GenerateNominations = ({
  setters = [],
  nominations: defaultNominations,
  batchKey,
  stepsSetup,
}: GenerateNominationsInnerProps) => {
  const { t } = useTranslation('library');
  const { isReady } = useApi();
  const { openModal } = useOverlay().modal;
  const { isFastUnstaking } = useUnstaking();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { setTargets } = useStaking();
  const { validators } = useValidators();
  const { fetch: fetchFromMethod } = useFetchMehods();

  // store the method of fetching validators
  const [method, setMethod] = useState<string | null>(null);

  // store whether validators are being fetched
  const [fetching, setFetching] = useState<boolean>(false);

  // store the currently selected set of nominations
  const [nominations, setNominations] = useState(defaultNominations);

  // store the height of the container
  const [height, setHeight] = useState<number | null>(null);

  // ref for the height of the container
  const heightRef = useRef<HTMLDivElement>(null);

  // update nominations on account switch
  useEffect(() => {
    if (nominations !== defaultNominations) {
      setNominations([...defaultNominations]);
    }
  }, [activeAccount]);

  // refetch if fetching is triggered
  useEffect(() => {
    if (!isReady || !validators.length) {
      return;
    }

    if (fetching) {
      fetchNominationsForMethod();
    }
  });

  // reset fixed height on window size change
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  const resizeCallback = () => {
    setHeight(null);
  };

  // fetch nominations based on method
  const fetchNominationsForMethod = () => {
    if (method) {
      const newNominations = fetchFromMethod(method);
      // update component state
      setNominations([...newNominations]);
      setFetching(false);
    }
  };

  const updateSetters = (newNominations: Nominations) => {
    for (const { current, set } of setters) {
      const currentValue = current?.callable ? current.fn() : current;
      set({
        ...currentValue,
        nominations: newNominations,
      });
    }
  };

  // function for clearing nomination list
  const clearNominations = () => {
    setMethod(null);
    setNominations([]);
    updateSetters([]);
  };

  // accumulate generation methods
  const methods = [
    {
      title: 'Display All',
      subtitle: 'List all validators.',
      icon: faUserEdit,
      onClick: () => {
        setMethod('Display All');
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: 'From Favorites',
      subtitle: 'Choose one of your favorite validators.',
      icon: faHeart,
      onClick: () => {
        setMethod('From Favorites');
        setNominations([]);
        setFetching(true);
      },
    },
  ];

  const defaultFilters = {
    includes: ['active'],
    excludes: ['all_commission', 'blocked_nominations', 'missing_identity'],
  };

  const validatorAction = {
    text: 'Nominate',
    iconLeft: faChevronCircleRight,
    onClick: (validator: any) => {
      setTargets({ nominations: [validator] });
      openModal({
        key: 'Nominate',
        options: {},
        size: 'sm',
      });
    },
  };

  const validatorOnSelectAction = (validator: any) => {
    setTargets({ nominations: [validator] });
    updateSetters([validator]);
  };

  return (
    <>
      {method && (
        <SelectableWrapper>
          <button type="button" onClick={() => clearNominations()}>
            <FontAwesomeIcon icon={faTimes} />
            {t(`${camelize(method)}`)}
          </button>

          {['Active Low Commission', 'Optimal Selection'].includes(
            method || ''
          ) && (
            <button
              type="button"
              onClick={() => {
                // set a temporary height to prevent height snapping on re-renders.
                setHeight(heightRef?.current?.clientHeight || null);
                setTimeout(() => setHeight(null), 200);
                setFetching(true);
              }}
            >
              {t('reGenerate')}
            </button>
          )}
        </SelectableWrapper>
      )}
      <Wrapper
        style={{
          height: height ? `${height}px` : 'auto',
          marginTop: method ? '1rem' : 0,
        }}
      >
        <div>
          {!isReadOnlyAccount(activeAccount) && !method && (
            <>
              <SelectItems layout="three-col">
                {methods.map((m: any, n: number) => (
                  <SelectItem
                    key={`gen_method_${n}`}
                    title={m.title}
                    subtitle={m.subtitle}
                    icon={m.icon}
                    selected={false}
                    onClick={m.onClick}
                    disabled={isFastUnstaking}
                    includeToggle={false}
                    grow={false}
                    hoverBorder
                    layout="three-col"
                  />
                ))}
              </SelectItems>
            </>
          )}
        </div>

        {fetching ? (
          <></>
        ) : (
          <>
            {isReady && method !== null && (
              <div
                ref={heightRef}
                style={{
                  width: '100%',
                }}
              >
                <ValidatorList
                  bondFor="nominator"
                  validators={nominations}
                  batchKey={batchKey}
                  defaultFilters={defaultFilters}
                  validatorAction={!stepsSetup && validatorAction}
                  validatorOnSelectAction={validatorOnSelectAction}
                  allowMoreCols
                  allowFilters
                  allowSearch
                  pagination
                  selectable={stepsSetup}
                  selectActive={stepsSetup}
                  selectToggleable={false}
                  allowListFormat={false}
                />
              </div>
            )}
          </>
        )}
      </Wrapper>
    </>
  );
};
