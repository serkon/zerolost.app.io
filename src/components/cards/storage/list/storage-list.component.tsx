import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { StorageAdd } from 'src/components/cards/storage/add/storage-add.components';
import { Storage, StorageCard } from 'src/components/cards/storage/card/storage-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import useTextTransform from 'src/hooks/case';
import { set_app_header } from 'src/store/reducers/app.reducer';

export interface ListRef {
  sortingClick: (state: boolean) => void;
  toolbarAction: (type: 'add' | 'edit') => void;
}

export interface StorageProps {}

export const StorageList = forwardRef<ListRef, StorageProps>((props, ref): React.ReactElement => {
  const { translate } = useTranslate();
  const { titleCase } = useTextTransform();
  const navigate = useNavigate();
  const store = useStore();
  const [storages, setStorages] = React.useState<Storage[]>([]);
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const { storageId } = useParams();
  const [selectedStorage, setSelectedStorage] = React.useState<Storage | null>(null);

  useImperativeHandle(ref, () => ({
    sortingClick: (sorting) => getStorageList(sorting),
    toolbarAction: (type: 'add' | 'edit') => storagesToolbarAction(type),
  }));

  const storagesToolbarAction = (type: 'add' | 'edit'): void => {
    setModalOpen(!isModalOpen);
    setModalMode(type);
  };
  const getStorageList = (sorting: boolean = false): void => {
    // TODO: çoklu sort şu şekilde yapılıyormuş  -->   ?page=0&size=10&sort=name,desc&sort=port,asc
    const params = { page: '0', size: '50', sort: ['name', `${sorting ? 'asc' : 'desc'}`].join(',') };

    api
      .post('/storage/search', {}, { params })
      .then((items: AxiosResponse<HttpResponse<Storage[]>>) => {
        const Storages = items.data.data;

        if (Storages.length > 0) {
          // TODO: Gereksiz bir kod blogu eklemek zorunda kaldım. Backend https://ipAddress şeklinde data dönüyor. Bunu yalın IP'ye çeviriyorum. BE ipAddress'i düzgün dönmeli
          Storages.forEach((storage) => {
            if (storage.ipAddress) {
              const [protocol, ipAddress] = storage.ipAddress.split('//');

              storage.ipAddress = ipAddress;
            }
          });

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
          title: titleCase(selectedStorage.name),
          label: translate('CREATED'),
          value: `${dayjs(selectedStorage.createdDate).format('MMMM D, YYYY h:mm A')}`,
        }),
      );
    }
  }, [selectedStorage]);

  const onSelectStorage = (storage: Storage): void => {
    setSelectedStorage(storage);
    navigate('/storage/' + storage.id);
  };

  return (
    <>
      <ul className="storages">
        {storages?.map((storage: Storage) => (
          <li className="storage-li-item" key={storage.ipAddress} onClick={onSelectStorage.bind(null, storage)} onDoubleClick={storagesToolbarAction.bind(null, 'edit')}>
            <StorageCard value={storage} selected={selectedStorage?.id === storage.id} />
          </li>
        ))}
      </ul>
      <StorageAdd opened={isModalOpen} closed={(): void => setModalOpen(false)} edit={modalMode} storage={selectedStorage} />
    </>
  );
});
