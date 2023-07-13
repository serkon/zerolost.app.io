import './disk-card.component.scss';

import { LoadingOverlay, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMinus, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { Disk, DiskCard } from 'src/components/cards/disk/card/disk-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

export const DiskList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const [disks, setDisks] = useState<Disk[]>([]);
  const [selectedDisk, setSelectedDisk] = useState<Disk | null>(null);
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState<{ page: number; size: number; totalPage: number }>({ page: 0, size: 5, totalPage: 0 });
  const { poolId } = useParams();
  const getDiskList = useCallback(() => {
    const params = new URLSearchParams({ page: paging.page.toString(), size: paging.size.toString() });

    setLoading(true);
    api
      .post('/disk/search', { id: poolId }, { params })
      .then((items: AxiosResponse<HttpResponse<Disk[]>>) => {
        const Disks = items.data.data;

        setLoading(false);
        setPaging((previousState) => ({
          ...previousState,
          totalPage: items.data.pagination.totalPages,
        }));

        if (Disks.length > 0) {
          setDisks((previousState) => (paging.page > 0 ? [...previousState, ...Disks] : Disks));
          if (!selectedDisk) {
            setSelectedDisk(() => Disks[0]);
          }
        } else {
          setDisks(() => []);
        }
      })
      .catch((error) => {
        setLoading(false);
        setDisks(() => []);
        notifications.show({
          title: translate('FAIL'),
          message: translate('API_DISK_LIST_GET_FAIL'),
          color: 'danger.3',
        });
      });
  }, [poolId, paging.page]);
  const more = (): void => {
    setPaging((previousState) => ({
      ...previousState,
      page: previousState.page + 1,
    }));
  };

  useEffect(() => {
    if (poolId) {
      setPaging((previousState) => ({ ...previousState, page: 0 }));
      setDisks(() => []);
      getDiskList();
    }
  }, [poolId]);

  useEffect(() => {
    getDiskList();
  }, [paging.page]);

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
        <TextInput type="text" placeholder={translate('SEARCH_IN_PHYSICAL_DISKS')} name="filter" size="sm" icon={<IconSearch size={16} />} className="filter-shadow" />
        {
          <div className="d-flex ms-2">
            <button className="btn btn-brand btn-ghost btn-sm">
              <IconMinus size={16} />
            </button>
            <button className="btn btn-brand btn-ghost btn-sm">
              <IconPlus size={16} />
            </button>
            <button className="btn btn-brand btn-ghost btn-sm">
              <IconTrash size={16} />
            </button>
          </div>
        }
      </div>
      <div className="disk-card-list mx-4 secondary-500  position-relative">
        <LoadingOverlay visible={loading} overlayBlur={2} />
        {disks.map((disk: any) => (
          <DiskCard value={disk} key={disk.id} onClick={onClickHandler.bind(null, disk)} selected={selectedDisk?.id === disk.id} />
        ))}
        {paging.page < paging.totalPage - 1 && <More onClick={more} count={paging.size} total={paging.totalPage} />}
      </div>
    </>
  );
};
