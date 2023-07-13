import './lune-list.component.scss';

import { TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppConfig } from 'src/app.config';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { Lune, LuneCard } from 'src/components/cards/lune/card/lune-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

// import Lunes from './lune.sample.json';

export const LuneList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const [lunes, setLunes] = useState<Lune[]>([]);
  const [selectedLune, setSelectedLune] = useState<Lune | null>(null);
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState<{ page: number; size: number; totalPage: number }>({ page: 0, size: AppConfig.paging.size, totalPage: 0 });
  const { poolId } = useParams();
  const getLuneList = useCallback(() => {
    const params = new URLSearchParams({ page: paging.page.toString(), size: paging.size.toString() });

    setLoading(true);
    api
      .post('/lun/search', { poolId }, { params })
      .then((items: AxiosResponse<HttpResponse<Lune[]>>) => {
        const Lunes = items.data.data;

        setLoading(false);
        setPaging((previousState) => ({
          ...previousState,
          totalPage: items.data.pagination.totalPages,
        }));
        if (Lunes.length > 0) {
          setLunes((previousState) => (paging.page > 0 ? [...previousState, ...Lunes] : Lunes));
          if (!selectedLune) {
            setSelectedLune(() => Lunes[0]);
          }
        } else {
          setLunes(() => []);
        }
      })
      .catch((error) => {
        setLoading(false);
        setLunes(() => []);
        notifications.show({
          title: translate('FAIL'),
          message: translate('API_DISK_LIST_GET_FAIL'),
          color: 'danger.3',
        });
      });
  }, [poolId]);
  const more = (): void => {
    setPaging((previousState) => ({
      ...previousState,
      page: previousState.page + 1,
    }));
  };

  useEffect(() => {
    if (poolId) {
      setPaging((previousState) => ({ ...previousState, page: 0 }));
      setLunes(() => []);
      getLuneList();
    }
  }, [poolId]);

  useEffect(() => {
    getLuneList();
  }, [paging.page]);

  const onClickHandler = useCallback(
    (value: Lune): void => {
      setSelectedLune(value);
    },
    [selectedLune],
  );

  return (
    <>
      <div className="filter-area px-4 d-flex align-items-center">
        <h5 className="fw-extra-bold secondary-600 flex-grow-1">
          <span>{translate('LUNES_ON_SELECTED_POOL')}</span>
        </h5>
        {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
        <TextInput type="text" placeholder={translate('SEARCH_IN_LUNES')} name="filter" size="sm" icon={<IconSearch size={16} />} className="filter-shadow" />
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
      <div className="lune-card-list mx-4 secondary-500">
        {lunes.map((lune: any) => (
          <LuneCard value={lune} key={lune.id} onClick={onClickHandler.bind(null, lune)} selected={selectedLune?.id === lune.id} />
        ))}
        {paging.page < paging.totalPage - 1 && <More onClick={more} count={paging.size} total={paging.totalPage} />}
      </div>
    </>
  );
};
