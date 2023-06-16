import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { useTranslate } from 'src/components/translate/translate.component';
import { set_app_header } from 'src/store/reducers/app.reducer';

import Storages from './storage.sample.json';
import { Storage, StorageCard } from './storage-card.component';

export const StorageList = (): React.ReactElement => {
  const navigate = useNavigate();
  const store = useStore();
  const { translate } = useTranslate();
  const [storages, setStorages] = React.useState<Storage[]>([]);
  const { storageId } = useParams();
  const [selectedStorage, setSelectedStorage] = React.useState<Storage | null>(null);
  const params = new URLSearchParams({ page: '0', size: '1' });
  const getStorageList = (): Promise<AxiosResponse<HttpResponse<Storage[]>>> => api.post('/storage/search', {}, { params });

  useEffect(() => {
    getStorageList()
      .then((items: AxiosResponse<HttpResponse<Storage[]>>) => {
        console.log('Hataya neden olur data ya bak: ', items.data);
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
      console.log(store.getState());
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
};
