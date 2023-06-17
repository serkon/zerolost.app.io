import './pool-list.component.scss';

import { TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { DiskList } from 'src/components/cards/disk/list/disk-list.component';
import { LuneList } from 'src/components/cards/lune/list/lune-list.component';
import { Pool, PoolCard } from 'src/components/cards/pool/card/pool-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

import Pools from './pool.sample.json';

export const PoolList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const { storageId, poolId } = useParams();
  const params = new URLSearchParams({ page: '0', size: '1' });
  const getPoolList = useCallback(() => api.post('/pool/search', { storageId }, { params }), [storageId]);

  useEffect(() => {
    getPoolList()
      .then((items: AxiosResponse<HttpResponse<Pool[]>>) => {
        // @TODO: const Pools = items.data.data;
        if (Pools.length > 0) {
          setPools(Pools as Pool[]);
          if (poolId) {
            const found = Pools.find((pool) => pool.id === poolId);

            found && setSelectedPool(found as Pool);
          } else {
            setSelectedPool(Pools[0] as Pool);
            navigate(`/storage/${storageId}/${Pools[0].id}`);
          }
        }
      })
      .catch((error) => {
        setPools([]);
      });
  }, [storageId]);

  const onClickHandler = (pool: Pool): void => {
    setSelectedPool(pool);
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
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconPlus size={16} />
          </button>
        </div>
      </div>
      {pools.length > 0 ? (
        <>
          <ul className="pool-card-list pool-list flex-wrap mx-4 secondary-500">
            {pools.map((pool: any) => (
              <li className="pool-li-item" onClick={onClickHandler.bind(null, pool)} key={pool.id}>
                <PoolCard value={pool} selected={selectedPool?.id === pool.id} />
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
    </>
  );
};
