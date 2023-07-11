import './host-empty.component.scss';

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useNavigate } from 'react-router-dom';
import { HostAdd } from 'src/components/cards/host/add/host-add.components';
import { Header } from 'src/components/header/header.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { set_app_header } from 'src/store/reducers/app.reducer';
import { DataState } from 'src/store/reducers/data.reducer';
import { RootState } from 'src/store/store';

import server from './server.svg';

export interface ModalState {
  mode: null | 'add' | 'edit' | 'delete';
}

export const HostEmpty = (): React.ReactElement => {
  const { translateState, translate } = useTranslate();
  const navigate = useNavigate();
  const [state, setState] = useState<ModalState>({ mode: null });
  const store = useStore();
  const dataState = useSelector<RootState>((state): DataState => state.dataStore) as DataState;
  const onAddClick = (): void => {
    setState((previousState) => ({ ...previousState, mode: 'add' }));
  };
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = (e: any): void => {
    setScrolled(e.target.scrollTop > 0);
  };
  const onModalClosed = (): void => {
    setState(() => ({ ...state, mode: null }));
    navigate('/host');
  };

  useEffect(() => {
    console.log(translateState);
    store.dispatch(
      set_app_header({
        title: translate('NEW_HOST'),
        label: translate('NOW'),
        value: `${dayjs(Date.now()).format('MMMM D, YYYY h:mm A')}`,
      }),
    );
  }, [translateState]);

  return (
    <>
      <div className={`screen-detail-container d-flex flex-column gap-4 pb-5 w-100`} onScroll={handleScroll}>
        <Header className={`scrollable-element ${scrolled ? 'scrolled' : ''}`} />
        <p className="body-16 px-4 secondary-400 m-0">{translate('HOST_PAGE_DESCRIPTION')}</p>
        <div className="w-100 d-flex flex-grow-1 align-items-center justify-content-center">
          <div className="empty-state p-5 d-flex flex-column align-items-center justify-content-center">
            <img src={server} alt="logo" className="logo mb-2" />
            <h3 className="fw-bold secondary-500 mb-1">{translate('ADD_NEW_HOST')}</h3>
            <p className="text-center secondary-500 mb-5">{translate('ADD_NEW_HOST_DESCRIPTION')}</p>
            <button className="btn btn-primary btn-xl" onClick={onAddClick}>
              {translate('Add')}
            </button>
          </div>
        </div>
      </div>

      {state.mode === 'add' && <HostAdd opened={!!state.mode} closed={(): void => onModalClosed()} edit={state.mode} host={null} />}
    </>
  );
};
