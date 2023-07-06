import './pool-list.component.scss';

import { LoadingOverlay, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { DiskList } from 'src/components/cards/disk/list/disk-list.component';
import { LuneList } from 'src/components/cards/lune/list/lune-list.component';
import { PoolAdd } from 'src/components/cards/pool/add/pool-add.components';
import { Pool, PoolCard } from 'src/components/cards/pool/card/pool-card.component';
import { PoolDelete } from 'src/components/cards/pool/delete/pool-delete.components';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

interface State {
  mode: 'add' | 'edit' | 'delete' | null;
  selectedPool: Pool | null;
  pools: Pool[];
}

export const PoolList = (): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ mode: null, selectedPool: null, pools: [] });
  const { storageId, poolId } = useParams();
  const params = new URLSearchParams({ page: '0', size: '50' });
  const getPoolList = useCallback(() => {
    setLoading(true);

    return api
      .post('/pool/search', { storageId }, { params })
      .then((items: AxiosResponse<HttpResponse<Pool[]>>) => {
        const Pools = items.data.data;

        setLoading(false);
        if (Pools.length > 0) {
          setState((previousState) => ({ ...previousState, pools: Pools }));
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
  }, [storageId]);
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

  useEffect(() => {
    getPoolList();
  }, [storageId]);

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
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
      {state.pools.length > 0 ? (
        <>
          <ul className="pool-card-list pool-list flex-wrap mx-4 secondary-500">
            {state.pools.map((pool: any) => (
              <li className="pool-li-item" onClick={onPoolClickHandler.bind(null, pool)} key={pool.id}>
                <PoolCard value={pool} selected={state.selectedPool?.id === pool.id} />
              </li>
            ))}
            <More />
          </ul>
          <DiskList />
          <LuneList />
        </>
      ) : (
        <div className="empty-state mx-4 p-4 dash d-flex flex-grow-1 align-items-center justify-content-center flex-column secondary-500">
          <h4 className="fw-extra-bold mb-3">{translate('NO_POOLS_FOUND')}</h4>
          <p className="fw-regular text-center">{translate('NO_POOLS_FOUND_DESCRIPTION')}</p>
          <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'add')}>
            {translate('ADD_POOL')}
          </button>
        </div>
      )}
      {(state.mode === 'add' || state.mode === 'edit') && <PoolAdd opened={!!state.mode} closed={onModalClosed} edit={state.mode} pool={state.selectedPool} />}
      {!!state.selectedPool && state.mode === 'delete' && <PoolDelete opened={!!state.mode} closed={onModalClosed} pool={state.selectedPool} />}
    </>
  );
};
