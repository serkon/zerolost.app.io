import { AxiosResponse } from 'axios';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { Storage, StorageCard } from 'src/components/cards/storage/card/storage-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { set_app_header } from 'src/store/reducers/app.reducer';

import Storages from './storage.sample.json';

export interface StorageListRef {
  sortingClick: () => void;
}

export interface StorageProps {}

export const StorageList = forwardRef<StorageListRef, StorageProps>((props, ref): React.ReactElement => {
  const navigate = useNavigate();
  const store = useStore();
  const { translate } = useTranslate();
  const [storages, setStorages] = React.useState<Storage[]>([]);
  const { storageId } = useParams();
  const [selectedStorage, setSelectedStorage] = React.useState<Storage | null>(null);
  const params = new URLSearchParams({ page: '0', size: '50' });

  useImperativeHandle(ref, () => ({
    sortingClick: getStorageList,
  }));

  const getStorageList = (): void => {
    api
      .post('/storage/search', {}, { params })
      .then((items: AxiosResponse<HttpResponse<Storage[]>>) => {
        // @TODO: const Storages = items.data.data;
        if (Storages.length > 0) {
          setStorages(Storages);

          if (storageId) {
            const found = Storages.find((storage) => storage.id === storageId);

            found && setSelectedStorage(found);
          } else {
            setSelectedStorage(Storages[0]);
            navigate(Storages[0].id);
          }
        }
      })
      .catch((error) => {
        setStorages([]);
      });
  };

  useEffect(() => {
    getStorageList();
  }, []);

  useEffect(() => {
    if (selectedStorage) {
      // TODO: add set header hook
      store.dispatch(
        set_app_header({
          title: selectedStorage.name,
          label: translate('INSTALLED'),
          value: selectedStorage.ip,
        }),
      );
    }
  }, [selectedStorage]);

  const onSelectStorage = (storage: Storage): void => {
    setSelectedStorage(storage);
    navigate(storage.id);
  };

  return (
    <ul className="storages">
      {storages?.map((storage: Storage) => (
        <li className="storage-li-item" key={storage.ip} onClick={onSelectStorage.bind(null, storage)}>
          <StorageCard value={storage} selected={selectedStorage?.id === storage.id} />
        </li>
      ))}
    </ul>
  );
});
