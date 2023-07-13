import './overview.component.scss';

import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PoolList } from 'src/components/cards/pool/list/pool-list.component';
import { ListRef, StorageList } from 'src/components/cards/storage/list/storage-list.component';
import { Header } from 'src/components/header/header.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { DataState } from 'src/store/reducers/data.reducer';
import { RootState } from 'src/store/store';

export const ScreenStorageOverview = (): React.ReactElement => {
  const { translate } = useTranslate();
  const { storageId } = useParams();
  const listRef = useRef<ListRef>(null);
  const [scrolled, setScrolled] = useState(false);
  const dataState = useSelector<RootState>((state): DataState => state.dataStore) as DataState;
  const handleScroll = (e: any): void => {
    setScrolled(e.target.scrollTop > 0);
  };

  return (
    <>
      <StorageList ref={listRef} />
      {dataState.storage.list && dataState.storage.list.length > 0 && (
        <div className={`screen-detail-container d-flex flex-column gap-4 pb-5 w-100`} onScroll={handleScroll}>
          <Header className={`scrollable-element ${scrolled ? 'scrolled' : ''}`} />
          <p className="body-16 px-4 secondary-400 m-0">{translate('STORAGE_DESCRIPTION')}</p>
          {storageId && <PoolList />}
        </div>
      )}
    </>
  );
};

export const More = ({ onClick, count = 8, total = 0 }: { onClick: () => void; count?: number; total?: number }): React.ReactElement => {
  const { translate } = useTranslate();
  const onClickHandler = useCallback((): void => {
    console.log('clicked');
    onClick();
  }, []);

  return (
    <div className={`pool-card card-more dash align-items-center justify-content-center`} onClick={onClickHandler}>
      <span className="d-flex flex-grow-0 flex-shring-1 brand-500 caption-12 fw-medium">{translate('MORE_WITH_COUNT', { count })}</span>
    </div>
  );
};
