import './overview.component.scss';

import React from 'react';
import { useTranslate } from 'src/components/translate/translate.component';

export const ScreenHostOverview = (): React.ReactElement => (
  <>
    <div className="list-items-container">host</div>
  </>
);

export const More = (): React.ReactElement => {
  const { translate } = useTranslate();

  return (
    <div className={`pool-card card-more dash align-items-center justify-content-center`}>
      <span className="d-flex flex-grow-0 flex-shring-1 brand-500 caption-12 fw-medium">{translate('MORE_WITH_COUNT', { count: 5 })}</span>
    </div>
  );
};
