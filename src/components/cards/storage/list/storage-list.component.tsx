import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { StorageAdd } from 'src/components/cards/storage/add/storage-add.components';
import { Storage, StorageCard } from 'src/components/cards/storage/card/storage-card.component';
import { StorageDelete } from 'src/components/cards/storage/delete/storage-delete.components';
import { useTranslate } from 'src/components/translate/translate.component';
import useTextTransform from 'src/hooks/case';
import { set_app_header } from 'src/store/reducers/app.reducer';

export type ToolbarActions = 'add' | 'edit' | 'delete' | null;

export interface ListRef {
  sortingClick: (state: boolean) => void;
  toolbarAction: (type: ToolbarActions) => void;
  state: StorageState;
}

export interface StorageProps {}

export interface StorageState {
  mode: ToolbarActions;
  selectedStorage: Storage | null;
  storages: Storage[];
}

export const StorageList = forwardRef<ListRef, StorageProps>((props, ref): React.ReactElement => {
  const { translate } = useTranslate();
  const { titleCase } = useTextTransform();
  const navigate = useNavigate();
  const store = useStore();
  const [state, setState] = useState<StorageState>({
    mode: null,
    selectedStorage: null,
    storages: [],
  });
  const { storageId } = useParams();

  useImperativeHandle(ref, () => ({
    sortingClick: (sorting) => getStorageList(sorting),
    toolbarAction: (type: ToolbarActions) => storagesToolbarAction(type),
    state,
  }));

  const storagesToolbarAction = (type: ToolbarActions): void => {
    setState({ ...state, mode: type });
  };
  const onModalClosed = (): void => {
    setState(() => ({ ...state, mode: null }));
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
          setState((prevState) => ({ ...prevState, storages: Storages }));
          if (storageId) {
            const found = Storages.find((storage) => storage.id === storageId);

            found && setState((prevState) => ({ ...prevState, selectedStorage: found }));
          } else {
            setState((prevState) => ({ ...prevState, selectedStorage: Storages[0] }));
            navigate('/storage/' + Storages[0].id);
          }
        }
      })
      .catch((error) => {
        setState((prevState) => ({ ...prevState, storages: [] }));
      });
  };

  useEffect(() => {
    if (state.mode === null) {
      getStorageList();
    }
  }, [state.mode]);

  useEffect(() => {
    if (state.selectedStorage) {
      // TODO: add set header hook
      store.dispatch(
        set_app_header({
          title: titleCase(state.selectedStorage.name),
          label: translate('CREATED'),
          value: `${dayjs(state.selectedStorage.createdDate).format('MMMM D, YYYY h:mm A')}`,
        }),
      );
    }
  }, [state.selectedStorage]);

  const onSelectStorage = (storage: Storage): void => {
    setState({ ...state, selectedStorage: storage });
    navigate('/storage/' + storage.id);
  };

  return (
    <>
      <ul className="storages">
        {state.storages?.map((storage: Storage) => (
          <li className="storage-li-item" key={storage.id} onClick={onSelectStorage.bind(null, storage)} onDoubleClick={storagesToolbarAction.bind(null, 'edit')}>
            <StorageCard value={storage} selected={state.selectedStorage?.id === storage.id} />
          </li>
        ))}
      </ul>
      {(state.mode === 'add' || state.mode === 'edit') && <StorageAdd opened={!!state.mode} closed={(): void => onModalClosed()} edit={state.mode} storage={state.selectedStorage} />}
      {!!state.selectedStorage && state.mode === 'delete' && <StorageDelete opened={!!state.mode} closed={onModalClosed} storage={state.selectedStorage} />}
    </>
  );
});
