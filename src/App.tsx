// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { I18nextProvider } from 'react-i18next';
import { ThemesProvider } from 'contexts/Themes';
import { i18next } from 'locale';
import { Providers } from 'Providers';

export const App = () => (
  <I18nextProvider i18n={i18next}>
    <ThemesProvider>
      <Providers />
    </ThemesProvider>
  </I18nextProvider>
);
