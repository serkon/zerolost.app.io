import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { set_app_header } from 'src/store/reducers/app.reducer';

import Storages from './storage.sample.json';
import { Storage, StorageCard } from './storage-card.component';

export const StorageList = (): React.ReactElement => {
  const navigate = useNavigate();
  const [storages, setStorages] = React.useState<Storage[]>();
  const [selectedStorage, setSelectedStorage] = React.useState<Storage | null>(null);
  const params = new URLSearchParams({ page: '0', size: '1' });
  const getStorageList = (): Promise<AxiosResponse<HttpResponse<Storage[]>>> => api.post('/storage/search', {}, { params });
  const store = useStore();

  useEffect(() => {
    getStorageList().then((items: AxiosResponse<HttpResponse<Storage[]>>) => {
      // @TODO: const Storages = items.data.data;
      console.log('Storages: ', items.data.data);
      !selectedStorage && Storages.length > 0 && setSelectedStorage(Storages[0]);
      setStorages(Storages);
    });
  }, []);

  useEffect(() => {
    if (selectedStorage) {
      store.dispatch(
        set_app_header({
          title: selectedStorage.name,
          label: 'Installed',
          value: selectedStorage.ip,
        }),
      );
      console.log(store.getState());
      navigate(selectedStorage.id);
    }
  }, [selectedStorage]);

  const onSelectStorage = (storage: Storage): void => {
    setSelectedStorage(storage);
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
};
