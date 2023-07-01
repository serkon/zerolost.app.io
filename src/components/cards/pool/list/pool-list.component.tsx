import './pool-list.component.scss';

import { TextInput } from '@mantine/core';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { DiskList } from 'src/components/cards/disk/list/disk-list.component';
import { LuneList } from 'src/components/cards/lune/list/lune-list.component';
import { PoolAdd } from 'src/components/cards/pool/add/pool-add.components';
import { Pool, PoolCard } from 'src/components/cards/pool/card/pool-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

interface State {
  mode: 'add' | 'edit' | 'delete' | null;
  selectedPool: Pool | null;
  pools: Pool[];
}

export const PoolList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ mode: null, selectedPool: null, pools: [] });
  const { storageId, poolId } = useParams();
  const params = new URLSearchParams({ page: '0', size: '50' });
  const getPoolList = useCallback(() => api.post('/pool/search', { storageId }, { params }), [storageId]);
  const toolbarAction = (type: 'add' | 'edit' | 'delete'): void => {
    setState({ ...state, mode: type });
  };

  useEffect(() => {
    getPoolList()
      .then((items: AxiosResponse<HttpResponse<Pool[]>>) => {
        const Pools = items.data.data;

        if (Pools.length > 0) {
          setState({ ...state, pools: Pools });
          if (poolId) {
            const found = Pools.find((pool) => pool.id === poolId);

            found && setState({ ...state, selectedPool: found });
          } else {
            setState({ ...state, selectedPool: Pools[0] });
            navigate(`/storage/${storageId}/${Pools[0].id}`);
          }
        }
      })
      .catch((error) => {
        setState({ ...state, pools: [] });
      });
  }, [storageId]);

  const onClickHandler = (pool: Pool): void => {
    setState({ ...state, selectedPool: pool });
    navigate(`/storage/${storageId}/${pool.id}`);
  };

  return (
    <>
      <div className="filter-area px-4 d-flex align-items-center">
        <h5 className="fw-extra-bold secondary-600 flex-grow-1">
          <span>{translate('AVAILABLE_POOLS')}</span>
        </h5>
        {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
        <TextInput type="text" placeholder={translate('SEARCH_IN_POOL')} name="filter" size="sm" icon={<IconSearch size={16} />} className="me-2 filter-shadow" />
        <div className="d-flex">
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconTrash size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'add')}>
            <IconPlus size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-sm" onClick={toolbarAction.bind(null, 'edit')} disabled={!state.selectedPool}>
            <IconEdit size={16} />
          </button>
        </div>
      </div>
      {state.pools.length > 0 ? (
        <>
          <ul className="pool-card-list pool-list flex-wrap mx-4 secondary-500">
            {state.pools.map((pool: any) => (
              <li className="pool-li-item" onClick={onClickHandler.bind(null, pool)} key={pool.id}>
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
          <button className="btn btn-brand btn-ghost btn-sm">{translate('ADD_POOL')}</button>
        </div>
      )}
      {(state.mode === 'add' || state.mode === 'edit') && <PoolAdd opened={!!state.mode} closed={(): void => setState({ ...state, mode: null })} edit={state.mode} pool={state.selectedPool} />}
    </>
  );
};
