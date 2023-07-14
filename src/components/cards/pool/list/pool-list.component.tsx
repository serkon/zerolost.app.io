import './pool-list.component.scss';

import { LoadingOverlay, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { DiskList } from 'src/components/cards/disk/list/disk-list.component';
import { LunList } from 'src/components/cards/lun/list/lun-list.component';
import { PoolManage } from 'src/components/cards/pool/add/pool-add.components';
import { Pool, PoolCard } from 'src/components/cards/pool/card/pool-card.component';
import { PoolDelete } from 'src/components/cards/pool/delete/pool-delete.components';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';
import { DataState, DataStateInit, set_storage_pool } from 'src/store/reducers/data.reducer';
import { RootState } from 'src/store/store';

import poolImage from './pool.svg';

interface State {
  mode: 'add' | 'edit' | 'delete' | null;
}

export const PoolList = (): React.ReactElement => {
  const dataStore = useSelector<RootState>((state): DataState => state.dataStore) as DataState;
  const store = useStore();
  const [state, setState] = useState<State>({ mode: null });
  const [loading, setLoading] = useState(false);
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const getPoolList = useCallback((): void => {
    setLoading(true);
    const { dataStore }: { dataStore: DataState } = store.getState() as RootState;
    const params = new URLSearchParams({ page: dataStore.storage.pool.page.toString(), size: dataStore.storage.pool.size.toString() });

    api
      .post('/pool/search', { storageId: dataStore.storage.selected?.id }, { params })
      .then((items: AxiosResponse<HttpResponse<Pool[]>>) => {
        const Pools = items.data.data;

        setLoading(false);
        if (Pools.length > 0) {
          store.dispatch(
            set_storage_pool({
              list: dataStore.storage.pool.page > 0 && dataStore.storage.pool.list ? [...dataStore.storage.pool.list, ...Pools] : Pools,
              totalPage: items.data.pagination.totalPages,
            }),
          );
          if (dataStore.storage.pool.selected) {
            const found = Pools.find((pool) => pool.id === dataStore.storage.pool.selected?.id);

            found && store.dispatch(set_storage_pool({ selected: found }));
          } else {
            store.dispatch(set_storage_pool({ selected: Pools[0] }));
            navigate(`/storage/${dataStore.storage.selected?.id}/${Pools[0].id}`);
          }
        } else {
          store.dispatch(set_storage_pool({ ...DataStateInit.storage.pool }));
        }
      })
      .catch((error) => {
        setLoading(false);
        store.dispatch(set_storage_pool({ ...DataStateInit.storage.pool }));
        notifications.show({
          title: translate('FAIL'),
          message: translate('API_POOL_LIST_GET_FAIL'),
          color: 'danger.3',
        });
      });
  }, [dataStore.storage.selected, dataStore.storage.pool.page]);
  const toolbarAction = (type: 'add' | 'edit' | 'delete'): void => {
    setState({ ...state, mode: type });
  };
  const onPoolClickHandler = (pool: Pool): void => {
    store.dispatch(set_storage_pool({ selected: pool }));
    navigate(`/storage/${dataStore.storage.selected?.id}/${pool.id}`);
  };
  const onModalClosed = (): void => {
    setState({ ...state, mode: null });
    getPoolList();
  };
  const more = (): void => {
    store.dispatch(set_storage_pool({ page: 1 }));
  };

  useEffect(() => {
    store.dispatch(set_storage_pool({ ...DataStateInit.storage.pool }));
    getPoolList();
  }, [dataStore.storage.selected]);

  useEffect(() => {
    // dataStore.storage.pool.selected === null && dataStore.storage.pool.page === 0 && dataStore.storage.pool.totalPage === 0 && getPoolList();
  }, [dataStore.storage.pool.selected]);

  useEffect(() => {
    dataStore.storage.pool.page > 0 && getPoolList();
  }, [dataStore.storage.pool.page]);

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      {dataStore.storage.pool.list && dataStore.storage.pool.list.length > 0 ? (
        <>
          <div className="filter-area px-4 d-flex align-items-center">
            <h5 className="fw-extra-bold secondary-600 flex-grow-1">
              <span>{translate('AVAILABLE_POOLS')}</span>
            </h5>
            {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
            <TextInput type="text" placeholder={translate('SEARCH_IN_POOL')} name="filter" size="sm" icon={<IconSearch size={16} />} className="me-2 filter-shadow" />
            <div className="d-flex">
              <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'delete')} disabled={!dataStore.storage.pool.selected}>
                <IconTrash size={16} />
              </button>
              <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'edit')} disabled={!dataStore.storage.pool.selected}>
                <IconEdit size={16} />
              </button>
              <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'add')}>
                <IconPlus size={16} />
              </button>
            </div>
          </div>
          <ul className="pool-card-list pool-list flex-wrap mx-4 secondary-500">
            {dataStore.storage.pool.list?.map((pool: any) => (
              <li className="pool-li-item" onClick={onPoolClickHandler.bind(null, pool)} key={pool.id}>
                <PoolCard value={pool} selected={dataStore.storage.pool.selected?.id === pool.id} />
              </li>
            ))}
            {dataStore.storage.pool.page < dataStore.storage.pool.totalPage - 1 && <More onClick={more} />}
          </ul>
          <DiskList />
          <LunList />
        </>
      ) : (
        <div className="empty-state dash d-flex m-auto align-items-center justify-content-center flex-column secondary-500">
          <img src={poolImage} alt="logo" className="logo mb-2" />
          <h3 className="fw-extra-bold mb-1">{translate('CREATE_NEW_POOL')}</h3>
          <p className="fw-regular text-center mb-5">{translate('CREATE_POOL_DESCRIPTION')}</p>
          <button className="btn btn-brand btn-lg" onClick={toolbarAction.bind(null, 'add')}>
            {translate('CREATE')}
          </button>
        </div>
      )}
      {(state.mode === 'add' || state.mode === 'edit') && <PoolManage opened={!!state.mode} closed={onModalClosed} edit={state.mode} pool={dataStore.storage.pool.selected} />}
      {!!dataStore.storage.pool.selected && state.mode === 'delete' && <PoolDelete opened={!!state.mode} closed={onModalClosed} pool={dataStore.storage.pool.selected} />}
    </>
  );
};
