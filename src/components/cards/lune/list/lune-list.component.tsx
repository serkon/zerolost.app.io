import './lune-list.component.scss';

import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { Lune, LuneCard } from 'src/components/cards/lune/card/lune-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

import Lunes from './lune.sample.json';

export const LuneList = (): React.ReactElement => {
  const { translate } = useTranslate();
  const [lunes, setLunes] = useState<Lune[]>([]);
  const [selectedLune, setSelectedLune] = useState<Lune | null>(null);
  const onClickHandler = useCallback(
    (value: Lune): void => {
      setSelectedLune(value);
    },
    [selectedLune],
  );
  const { poolId } = useParams();
  const params = new URLSearchParams({ page: '0', size: '8' });
  const getLuneList = useCallback(() => api.post('/lun/search', { poolId }, { params }), [poolId]);

  useEffect(() => {
    if (poolId) {
      getLuneList()
        .then((items: AxiosResponse<HttpResponse<Lune[]>>) => {
          // TODO: const Lunes = items.data.data;
          if (Lunes.length > 0) {
            setLunes(Lunes as Lune[]);
            if (!selectedLune) {
              setSelectedLune(Lunes[0] as Lune);
            }
          }
        })
        .catch((error) => {
          setLunes([]);
        });
    }
  }, [poolId]);

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
        {Lunes.map((lune: any) => (
          <LuneCard value={lune} key={lune.id} onClick={onClickHandler.bind(null, lune)} selected={selectedLune?.id === lune.id} />
        ))}
        <More />
      </div>
    </>
  );
};
