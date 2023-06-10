import './disk-card.component.scss';

import { TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import React, { useCallback, useState } from 'react';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

import Disks from './disk.sample.json';

interface Disk {
  id: string;
  name: string;
  diskSize: string;
  diskType: 'Cache' | 'Data' | 'Log';
  status: 'ONLINE' | 'OFFLINE';
  createdDate: string;
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  chassisId: string;
  chassisName: string;
  storageId: string;
}

export const DiskCard = ({ value }: { value: Disk }): React.JSX.Element => {
  const [select, setSelect] = useState<string[]>([]);
  const onClickHandler = useCallback(
    (value: Disk): void => {
      select.includes(value.id) ? setSelect(select.filter((id) => id !== value.id)) : setSelect([...select, value.id]);
    },
    [select],
  );

  return (
    <div className={`disk-card d-flex flex-column gap-2 p-3 flex-grow-1 ${select.includes(value.id) ? 'selected' : 'secondary-400'}`} onClick={onClickHandler.bind(null, value)}>
      <header className="d-flex flex-column gap-1">
        <h4 className="caption-16 fw-semibold d-flex gap-2">
          {value?.name}
          <span className={`mt-1 ${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
        </h4>
        <aside className="d-flex gap-1 caption-10">
          <span className="fw-bold">{value.diskSize}</span>
          <span className="fw-bold">•</span>
          <span className="fw-regular">{value.diskType}</span>
        </aside>
      </header>
      <section className="body d-flex">
        <span className="storage-right caption-10 fw-light gap-1 d-flex">{value.chassisName}</span>
      </section>
    </div>
  );
};

export const DiskList = (): React.ReactElement => {
  const { translate } = useTranslate();

  return (
    <>
      <div className="filter-area px-4 d-flex align-items-center">
        <h5 className="fw-extra-bold secondary-600 flex-grow-1">
          <span>{translate('PHYSICAL_DISK')}</span>
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
      <div className="card-list mx-4">
        {Disks.map((disk: any) => (
          <DiskCard value={disk} key={disk.id} />
        ))}
        <More />
      </div>
    </>
  );
};
