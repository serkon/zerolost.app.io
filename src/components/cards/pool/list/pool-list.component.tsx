import './pool-list.component.scss';

import { LoadingOverlay, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppConfig } from 'src/app.config';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { DiskList } from 'src/components/cards/disk/list/disk-list.component';
import { LuneList } from 'src/components/cards/lune/list/lune-list.component';
import { PoolAdd } from 'src/components/cards/pool/add/pool-add.components';
import { Pool, PoolCard } from 'src/components/cards/pool/card/pool-card.component';
import { PoolDelete } from 'src/components/cards/pool/delete/pool-delete.components';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

import poolImage from './pool.svg';

interface State {
  mode: 'add' | 'edit' | 'delete' | null;
  selectedPool: Pool | null;
  pools: Pool[];
  paging: { page: number; size: number; totalPage: number };
  storageId: string | undefined;
}

const initial: State = { mode: null, selectedPool: null, pools: [], paging: { page: 0, size: AppConfig.paging.size, totalPage: 0 }, storageId: undefined };

export const PoolList = (): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const [state, setState] = useState<State>(initial);
  const { storageId, poolId } = useParams();
  const getPoolList = useCallback((): void => {
    if (state.storageId !== undefined) {
      setLoading(true);
      const params = new URLSearchParams({ page: state.paging.page.toString(), size: state.paging.size.toString() });

      api
        .post('/pool/search', { storageId }, { params })
        .then((items: AxiosResponse<HttpResponse<Pool[]>>) => {
          const Pools = items.data.data;

          setLoading(false);
          if (Pools.length > 0) {
            setState((previousState) => ({
              ...previousState,
              pools: previousState.paging.page > 0 ? [...previousState.pools, ...Pools] : Pools,
              paging: { ...previousState.paging, totalPage: items.data.pagination.totalPages },
            }));
            if (poolId) {
              const found = Pools.find((pool) => pool.id === poolId);

              found && setState((previousState) => ({ ...previousState, selectedPool: found }));
            } else {
              setState((previousState) => ({ ...previousState, selectedPool: Pools[0] }));
              navigate(`/storage/${storageId}/${Pools[0].id}`);
            }
          } else {
            setState((previousState) => ({ ...previousState, pools: [] }));
          }
        })
        .catch((error) => {
          setLoading(false);
          setState({ ...state, pools: [] });
          notifications.show({
            title: translate('FAIL'),
            message: translate('API_POOL_LIST_GET_FAIL'),
            color: 'danger.3',
          });
        });
    }
  }, [state.storageId, state.paging.page]);
  const toolbarAction = (type: 'add' | 'edit' | 'delete'): void => {
    setState({ ...state, mode: type });
  };
  const onPoolClickHandler = (pool: Pool): void => {
    setState({ ...state, selectedPool: pool });
    navigate(`/storage/${storageId}/${pool.id}`);
  };
  const onModalClosed = (): void => {
    setState({ ...state, mode: null });
    getPoolList();
  };
  const more = (): void => {
    setState((previousState) => ({
      ...previousState,
      paging: { page: previousState.paging.page + 1, size: previousState.paging.size, totalPage: previousState.paging.totalPage },
    }));
  };

  useEffect(() => {
    setState((previousState) => ({ ...initial, storageId }));
  }, [storageId]);

  useEffect(() => {
    getPoolList();
  }, [state.paging.page, state.storageId]);

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      {state.pools.length > 0 ? (
        <>
          <div className="filter-area px-4 d-flex align-items-center">
            <h5 className="fw-extra-bold secondary-600 flex-grow-1">
              <span>{translate('AVAILABLE_POOLS')}</span>
            </h5>
            {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
            <TextInput type="text" placeholder={translate('SEARCH_IN_POOL')} name="filter" size="sm" icon={<IconSearch size={16} />} className="me-2 filter-shadow" />
            <div className="d-flex">
              <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'delete')} disabled={!state.selectedPool}>
                <IconTrash size={16} />
              </button>
              <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'edit')} disabled={!state.selectedPool}>
                <IconEdit size={16} />
              </button>
              <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'add')}>
                <IconPlus size={16} />
              </button>
            </div>
          </div>
          <ul className="pool-card-list pool-list flex-wrap mx-4 secondary-500">
            {state.pools.map((pool: any) => (
              <li className="pool-li-item" onClick={onPoolClickHandler.bind(null, pool)} key={pool.id}>
                <PoolCard value={pool} selected={state.selectedPool?.id === pool.id} />
              </li>
            ))}
            {state.paging.page < state.paging.totalPage - 1 && <More onClick={more} />}
          </ul>
          <DiskList />
          <LuneList />
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
      {(state.mode === 'add' || state.mode === 'edit') && <PoolAdd opened={!!state.mode} closed={onModalClosed} edit={state.mode} pool={state.selectedPool} />}
      {!!state.selectedPool && state.mode === 'delete' && <PoolDelete opened={!!state.mode} closed={onModalClosed} pool={state.selectedPool} />}
    </>
  );
};
