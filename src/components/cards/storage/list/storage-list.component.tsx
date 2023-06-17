import { AxiosResponse } from 'axios';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { StorageAdd } from 'src/components/cards/storage/add/add.components';
import { Storage, StorageCard } from 'src/components/cards/storage/card/storage-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { set_app_header } from 'src/store/reducers/app.reducer';

export interface ListRef {
  sortingClick: (state: boolean) => void;
  addClick: () => void;
}

export interface StorageProps {}

export const StorageList = forwardRef<ListRef, StorageProps>((props, ref): React.ReactElement => {
  const navigate = useNavigate();
  const store = useStore();
  const { translate } = useTranslate();
  const [storages, setStorages] = React.useState<Storage[]>([]);
  const [add, setAdd] = React.useState<boolean>(false);
  const { storageId } = useParams();
  const [selectedStorage, setSelectedStorage] = React.useState<Storage | null>(null);

  useImperativeHandle(ref, () => ({
    sortingClick: (sorting) => getStorageList(sorting),
    addClick: () => addStorage(),
  }));

  const addStorage = (): void => {
    setAdd(!add);
  };
  const getStorageList = (sorting: boolean = false): void => {
    console.log(sorting);
    const params = new URLSearchParams({ page: '0', size: '50', sort: sorting ? 'name' : '' });

    api
      .post('/storage/search', {}, { params })
      .then((items: AxiosResponse<HttpResponse<Storage[]>>) => {
        const Storages = items.data.data;

        if (Storages.length > 0) {
          setStorages(Storages as Storage[]);

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
          value: `${selectedStorage.ipAddress}:${selectedStorage.port}`,
        }),
      );
    }
  }, [selectedStorage]);

  const onSelectStorage = (storage: Storage): void => {
    setSelectedStorage(storage);
    navigate(storage.id);
  };

  return (
    <>
      <ul className="storages">
        {storages?.map((storage: Storage) => (
          <li className="storage-li-item" key={storage.ipAddress} onClick={onSelectStorage.bind(null, storage)}>
            <StorageCard value={storage} selected={selectedStorage?.id === storage.id} />
          </li>
        ))}
      </ul>
      <StorageAdd opened={add} closed={(): void => setAdd(false)} />
    </>
  );
});
