import './disk-card.component.scss';

import { LoadingOverlay, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMinus, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppConfig } from 'src/app.config';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { Disk, DiskCard } from 'src/components/cards/disk/card/disk-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

interface State {
  selectedDisk: Disk | null;
  disks: Disk[];
  paging: { page: number; size: number; totalPage: number };
  poolId: string | undefined;
}

const initial: State = { selectedDisk: null, disks: [], paging: { page: 0, size: AppConfig.paging.size, totalPage: 0 }, poolId: undefined };

export const DiskList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const [state, setState] = useState<State>(initial);
  const [loading, setLoading] = useState(false);
  const { poolId } = useParams();
  const getDiskList = useCallback(() => {
    if (state.poolId !== undefined) {
      const params = new URLSearchParams({ page: state.paging.page.toString(), size: state.paging.size.toString() });

      setLoading(true);
      api
        .post('/disk/search', { id: poolId }, { params })
        .then((items: AxiosResponse<HttpResponse<Disk[]>>) => {
          const Disks = items.data.data;

          setLoading(false);
          if (Disks.length > 0) {
            setState((previousState): State => {
              const found = previousState.selectedDisk && [...previousState.disks, ...Disks].find((disk) => disk.id === state.selectedDisk?.id);

              return {
                ...previousState,
                disks: previousState.paging.page > 0 ? [...previousState.disks, ...Disks] : Disks,
                paging: { ...previousState.paging, totalPage: items.data.pagination.totalPages },
                selectedDisk: found ? found : [...previousState.disks, ...Disks][0],
              };
            });
          } else {
            setState((previousState) => ({ ...initial, poolId }));
          }
        })
        .catch((error) => {
          setLoading(false);
          setState((previousState) => ({ ...initial, poolId }));
          notifications.show({
            title: translate('FAIL'),
            message: translate('API_DISK_LIST_GET_FAIL'),
            color: 'danger.3',
          });
        });
    }
  }, [state.poolId, state.paging.page]);
  const more = (): void => {
    setState((previousState) => ({
      ...previousState,
      paging: { page: previousState.paging.page + 1, size: previousState.paging.size, totalPage: previousState.paging.totalPage },
    }));
  };
  const onClickHandler = useCallback(
    (value: Disk): void => {
      setState((previousState) => ({ ...previousState, selectedDisk: value }));
    },
    [state.selectedDisk],
  );

  useEffect(() => {
    if (poolId) {
      setState((previousState) => ({ ...initial, poolId }));
    }
  }, [poolId]);

  useEffect(() => {
    getDiskList();
  }, [state.poolId, state.paging.page]);

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
        {state.disks.map((disk: any) => (
          <DiskCard value={disk} key={disk.id} onClick={onClickHandler.bind(null, disk)} selected={state.selectedDisk?.id === disk.id} />
        ))}
        {state.paging.page < state.paging.totalPage - 1 && <More onClick={more} count={state.paging.size} total={state.paging.totalPage} />}
      </div>
    </>
  );
};
