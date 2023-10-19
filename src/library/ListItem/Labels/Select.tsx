// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectSingleWrapper, SelectWrapper } from 'library/ListItem/Wrappers';
import styled from 'styled-components';
import { useList } from '../../List/context';
import type { SelectProps } from '../types';

export const Select = ({ item }: SelectProps) => {
  const { addToSelected, removeFromSelected, selected } = useList();

  const isSelected = selected.includes(item);

  return (
    <SelectWrapper
      onClick={() => {
        if (isSelected) {
          removeFromSelected([item]);
        } else {
          addToSelected(item);
        }
      }}
    >
      {isSelected && <FontAwesomeIcon icon={faCheck} transform="shrink-2" />}
    </SelectWrapper>
  );
};

export const SelectSingle = (props: SelectProps) => {
  const { item, onSelect } = props;

  const { addAsSingleSelect, selected } = useList();

  const isSelected = selected.includes(item);

  return (
    <SelectSingleWrapper
      onClick={() => {
        addAsSingleSelect(item);
        if (onSelect) {
          onSelect();
        }
      }}
    >
      {isSelected && (
        <StyledFontAwesomeIcon
          icon={faCircle as IconProp}
          transform="shrink-2"
        />
      )}
    </SelectSingleWrapper>
  );
};

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: var(--text-color-primary);
`;
