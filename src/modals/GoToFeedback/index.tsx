// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalPadding } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ForumSVG } from 'img/forum.svg';
import { Title } from 'library/Modal/Title';

export const GoToFeedback = () => {
  const { t } = useTranslation('modals');
  return (
    <>
      <Title title={t('feedback')} Svg={ForumSVG} />
      <ModalPadding verticalOnly>
        <div
          style={{
            padding: '0 1.75rem 0.5rem 1.75rem',
            width: '100%',
          }}
        >
          <h4 style={{ paddingBottom: '0.75rem' }}>
            Best way to contact us is to join our Discord. Bug reports, feature
            requests and improvements are all welcome.
          </h4>
          <h2 style={{ marginTop: '0.75rem' }}>
            <a
              href="https://discord.com/invite/alephzero"
              target="_blank"
              rel="noreferrer"
            >
              Open our Discord &nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
          </h2>
        </div>
      </ModalPadding>
    </>
  );
};
