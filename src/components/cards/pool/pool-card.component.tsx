import './pool-card.component.scss';

import { TextInput } from '@mantine/core';
import { IconPlus,IconSearch, IconTrash } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

import Pools from './pool.sample.json';

export const PoolCard = ({ value }: { value: Pool }): React.JSX.Element => {
  const {translate} = useTranslate();
  const [select, setSelect] = useState<string[]>([]);
  const [diskCount, setDiskCount] = useState(0);
  const onClickHandler = useCallback(
    (value: Pool): void => {
      select.includes(value.id) ? setSelect(select.filter((id) => id !== value.id)) : setSelect([...select, value.id]);
    },
    [select],
  );

  useEffect(() => {
    setDiskCount(value.disks.reduce((sum, val) => sum + val.count, 0));
  },[value]);

  return (
    <div className={`pool-card d-flex flex-column gap-3 p-3 ${select.includes(value.id) ? 'selected' : 'secondary-400'}`} onClick={onClickHandler.bind(null, value)}>
      <header className="d-flex flex-column gap-1">
        <h4 className="caption-16 fw-semibold d-flex gap-2 align-items-center">
          <span className="text-truncate lh-sm">{value?.name}</span>
          <span className={`${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
          <span className="d-flex ms-auto caption-10 fw-semibold circle align-items-center justify-content-center">{diskCount}</span>
        </h4>
        <aside className="d-flex gap-1 caption-10">
          <span className="fw-light">{translate('USAGE_SNAPSHOT')}</span>
          <span className="fw-bold">•</span>
          <span className="fw-light">{value.usageSnapshot ? value.usageSnapshot : 'N/A'}</span>
        </aside>
      </header>
      <section className="body d-flex">
        {
          value.disks.map((disk: PoolDisk, key: number) => (
            <aside className={`card-value-item d-flex flex-column gap-1 ${key < value.disks.length - 1 ? 'divider' : ''}`} key={key}>
              <span className="title caption-12 fw-semibold flex-grow-1 text-nowrap">{translate('POOL_DISK_TYPE_' + disk.type)}</span>
              <span className="caption-10 fw-regular d-flex text-nowrap">{translate('DISKS.'+disk.profile)}</span>
              <span className="caption-10 fw-light d-flex text-nowrap">{disk.used} / {disk.size}</span>
            </aside>
          ))
        }
      </section>
    </div>
  );
};

export const PoolList = (): React.ReactElement => {
  const {translate} = useTranslate();

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
      <div className="pool-card-list mx-4">
        {Pools.map((pool: any) => (
          <PoolCard value={pool} key={pool.id} />
        ))}
        <More />
      </div>
    </>
  );
};

export interface Pool{
  id: string;
  name: string;
  storageId: string;
  status: 'ONLINE' | 'OFFLINE';
  lastModifiedDate: string;
  createdDate: string;
  usageSnapshot: string;
  disks: PoolDisk[];
}

export type Profile = 'mirror'| 'mirror3'| 'raidz1'| 'raidz2'| 'raidz3_max'| 'stripe';
export interface PoolDisk {type: 'data' | 'log' | 'cache'; profile: Profile; size: string; used: string; percentage: number, count: number;}
