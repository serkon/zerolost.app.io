import './disk-card.component.scss';

import { TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { Disk, DiskCard } from 'src/components/cards/disk/card/disk-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

import Disks from './disk.sample.json';

export const DiskList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const [disks, setDisks] = useState<Disk[]>([]);
  const [selectedDisk, setSelectedDisk] = useState<Disk | null>(null);
  const { poolId } = useParams();
  const params = new URLSearchParams({ page: '0', size: '8' });
  // @TODO: '/disk/search'
  const getDiskList = useCallback(() => api.post('/host/search', { poolId }, { params }), [poolId]);

  useEffect(() => {
    if (poolId) {
      getDiskList()
        .then((items: AxiosResponse<HttpResponse<Disk[]>>) => {
          // @TODO: const Disks = items.data.data;
          if (Disks.length > 0) {
            setDisks(Disks as Disk[]);
            if (!selectedDisk) {
              setSelectedDisk(Disks[0] as Disk);
            }
          }
        })
        .catch((error) => {
          setDisks([]);
        });
    }
  }, [poolId]);

  const onClickHandler = useCallback(
    (value: Disk): void => {
      setSelectedDisk(value);
    },
    [selectedDisk],
  );

  return (
    <>
      <div className="filter-area px-4 d-flex align-items-center">
        <h5 className="fw-extra-bold secondary-600 flex-grow-1">
          <span>{translate('PHYSICAL_DISKS_ON_SELECTED_POOL')}</span>
        </h5>
        {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
        <TextInput type="text" placeholder={translate('SEARCH_IN_PHYSICAL_DISKS')} name="filter" size="sm" icon={<IconSearch size={16} />} className="me-2 filter-shadow" />
        <div className="d-flex">
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconTrash size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconPlus size={16} />
          </button>
        </div>
      </div>
      <div className="disk-card-list mx-4 secondary-500">
        {disks.map((disk: any) => (
          <DiskCard value={disk} key={disk.id} onClick={onClickHandler.bind(null, disk)} selected={selectedDisk?.id === disk.id} />
        ))}
        <More />
      </div>
    </>
  );
};
