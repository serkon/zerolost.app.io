import './lun-list.component.scss';

import { LoadingOverlay, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppConfig } from 'src/app.config';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { Lun, LunCard } from 'src/components/cards/lun/card/lun-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

// import Luns from './lun.sample.json';

interface State {
  selectedLun: Lun | null;
  luns: Lun[];
  paging: { page: number; size: number; totalPage: number };
  poolId: string | undefined;
}

const initial: State = { selectedLun: null, luns: [], paging: { page: 0, size: AppConfig.paging.size, totalPage: 0 }, poolId: undefined };

export const LunList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const [state, setState] = useState<State>(initial);
  const [loading, setLoading] = useState(false);
  const { poolId } = useParams();
  const getLunList = useCallback(() => {
    if (state.poolId !== undefined) {
      const params = new URLSearchParams({ page: state.paging.page.toString(), size: state.paging.size.toString() });

      setLoading(true);
      api
        .post('/lun/search', { poolId }, { params })
        .then((items: AxiosResponse<HttpResponse<Lun[]>>) => {
          const Luns = items.data.data;

          setLoading(false);
          if (Luns.length > 0) {
            setState((previousState): State => {
              const found = previousState.selectedLun && [...previousState.luns, ...Luns].find((disk) => disk.id === state.selectedLun?.id);

              return {
                ...previousState,
                luns: previousState.paging.page > 0 ? [...previousState.luns, ...Luns] : Luns,
                paging: { ...previousState.paging, totalPage: items.data.pagination.totalPages },
                selectedLun: found ? found : [...previousState.luns, ...Luns][0],
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
            message: translate('API_LUN_LIST_GET_FAIL'),
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
    (value: Lun): void => {
      setState((previousState): State => ({ ...previousState, selectedLun: value }));
    },
    [state.selectedLun],
  );

  useEffect(() => {
    if (poolId) {
      setState((previousState) => ({ ...initial, poolId }));
    }
  }, [poolId]);

  useEffect(() => {
    getLunList();
  }, [state.poolId, state.paging.page]);

  return (
    <>
      {state.luns && state.luns.length > 0 && (
        <div className="filter-area px-4 d-flex align-items-center">
          <h5 className="fw-extra-bold secondary-600 flex-grow-1">
            <span>{translate('LUN_ON_SELECTED_POOL')}</span>
          </h5>
          {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
          <TextInput type="text" placeholder={translate('SEARCH_IN_LUN')} name="filter" size="sm" icon={<IconSearch size={16} />} className="filter-shadow" />
          {/*
          <div className="d-flex ms-2">
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconTrash size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconPlus size={16} />
          </button>
        </div>
          */}
        </div>
      )}
      <div className="lun-card-list mx-4 secondary-500 position-relative">
        <LoadingOverlay visible={loading} overlayBlur={2} />

        {state.luns.map((lun: any) => (
          <LunCard value={lun} key={lun.id} onClick={onClickHandler.bind(null, lun)} selected={state.selectedLun?.id === lun.id} />
        ))}
        {state.paging.page < state.paging.totalPage - 1 && <More onClick={more} count={state.paging.size} total={state.paging.totalPage} />}
      </div>
    </>
  );
};
