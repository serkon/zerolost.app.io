import { LoadingOverlay, Menu, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowsLeftRight, IconEdit, IconFilter, IconMessageCircle, IconPhoto, IconPlus, IconSearch, IconSettings, IconSortAscending, IconSortDescending, IconTrash, IconX } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { AppConfig } from 'src/app.config';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { StorageAdd } from 'src/components/cards/storage/add/storage-add.components';
import { Storage, StorageCard } from 'src/components/cards/storage/card/storage-card.component';
import { StorageDelete } from 'src/components/cards/storage/delete/storage-delete.components';
import { useTranslate } from 'src/components/translate/translate.component';
import useTextTransform from 'src/hooks/case';
import { set_app_header } from 'src/store/reducers/app.reducer';
import { DataState, set_storages } from 'src/store/reducers/data.reducer';
import { RootState } from 'src/store/store';

export type ToolbarActions = 'add' | 'edit' | 'delete' | null;

export interface ListRef {
  sortingClick: (state: boolean) => void;
  toolbarAction: (type: ToolbarActions) => void;
  state: StorageState;
}

export interface StorageProps {}

export interface StorageState {
  mode: ToolbarActions;
}

export const StorageList = forwardRef<ListRef, StorageProps>((props, ref): React.ReactElement => {
  const { translate } = useTranslate();
  const { titleCase } = useTextTransform();
  const navigate = useNavigate();
  const store = useStore();
  const dataState = useSelector<RootState>((state): DataState => state.dataStore) as DataState;
  const [query, setQuery] = React.useState<string>('');
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [sorting, setSorting] = useState(false);
  const [state, setState] = useState<StorageState>({
    mode: null,
  });
  const { storageId } = useParams();
  const storagesToolbarAction = (type: ToolbarActions): void => {
    setState({ ...state, mode: type });
  };
  const onModalClosed = (): void => {
    setState(() => ({ ...state, mode: null }));
  };
  const getStorageList = (sorting: boolean = false): void => {
    // TODO: çoklu sort şu şekilde yapılıyormuş  -->   ?page=0&size=10&sort=name,desc&sort=port,asc
    const params = { page: '0', size: AppConfig.paging.size, sort: ['name', `${sorting ? 'asc' : 'desc'}`].join(',') };

    store.dispatch(set_storages({ list: [], selected: null, loading: true }));
    api
      .post('/storage/search', {}, { params })
      .then((items: AxiosResponse<HttpResponse<Storage[]>>) => {
        const Storages = items.data.data;

        store.dispatch(set_storages({ loading: false }));
        // eslint-disable-next-line max-len
        store.dispatch(set_storages(Storages.length > 0 ? { list: Storages, selected: storageId ? Storages.find((storage) => storage.id === storageId) || null : Storages[0] } : { list: [], selected: null }));
        !storageId && navigate(Storages.length > 0 ? '/storage/' + Storages[0].id : '/storage/empty');
      })
      .catch((error) => {
        store.dispatch(set_storages({ list: [], selected: null, loading: false }));
        !storageId && navigate('/host/empty');
        notifications.show({
          title: translate('FAIL'),
          autoClose: false,
          message: error.response?.data.message || translate('API_STORAGE_LIST_FAIL'),
          color: 'danger.3',
        });
      });
  };

  useImperativeHandle(ref, () => ({
    sortingClick: (sorting) => getStorageList(sorting),
    toolbarAction: (type: ToolbarActions) => storagesToolbarAction(type),
    state,
  }));

  useEffect(() => {
    if (state.mode === null) {
      getStorageList();
    }
  }, [state.mode]);

  useEffect(() => {
    if (dataState.storage.selected) {
      // TODO: add set header hook
      store.dispatch(
        set_app_header({
          title: titleCase(dataState.storage.selected.name),
          label: translate('CREATED'),
          value: `${dayjs(dataState.storage.selected.createdDate).format('MMMM D, YYYY h:mm A')}`,
        }),
      );
    }
  }, [dataState.storage.selected]);

  const onSelectStorage = (storage: Storage): void => {
    store.dispatch(set_storages({ list: dataState.storage.list, selected: storage, loading: false }));
    navigate('/storage/' + storage.id);
  };

  return (
    <>
      <div className="list-items-container">
        <section className="list-items-header px-3">
          <h2 className="h2 fw-extra-bold secondary-500">{translate('STORAGES')}</h2>
          <p className="m-0 secondary-400 fw-light caption-14">{translate('SLOGAN')}</p>
        </section>
        <section className="filter px-3">
          <Menu shadow="md" width={200} position="bottom-start">
            <Menu.Target>
              <div className="caption-10 secondary-400 ti-chevron-down ti-right flex-grow-1 justify-content-start">Ordering by Name</div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
              <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
              <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
              <Menu.Item
                icon={<IconSearch size={14} />}
                rightSection={
                  <Text size="xs" color="dimmed">
                    ⌘K
                  </Text>
                }
              >
                Search
              </Menu.Item>
              <Menu.Divider />
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
              <Menu.Item color="red" icon={<IconTrash size={14} />}>
                Delete my account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <button className={`btn btn-brand ${!filterOpen && 'btn-ghost'} btn-xs`} onClick={(): void => setFilterOpen(!filterOpen)}>
            <IconFilter size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-xs" onClick={storagesToolbarAction.bind(null, 'delete')}>
            <IconTrash size={16} />
          </button>
          <button
            className={`btn btn-brand btn-ghost btn-xs`}
            onClick={(): void => {
              setSorting(() => !sorting);
              getStorageList();
            }}
          >
            {sorting ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
          </button>
          <button className={`btn btn-brand btn-ghost btn-xs`} onClick={storagesToolbarAction.bind(null, 'edit')}>
            <IconEdit size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-xs" onClick={storagesToolbarAction.bind(null, 'add')}>
            <IconPlus size={16} />
          </button>
        </section>
        <section className={`search d-flex px-3 flex-column ${!filterOpen && 'd-none'}`}>
          <TextInput
            size="sm"
            icon={<IconSearch size={16} />}
            placeholder={translate('SEARCH')}
            value={query}
            onChange={(e): void => setQuery(e.currentTarget.value)}
            rightSection={
              query ? (
                <IconX
                  size={16}
                  style={{
                    display: 'block',
                    opacity: 0.5,
                    cursor: 'pointer',
                  }}
                  onClick={(): void => setQuery('')}
                />
              ) : null
            }
          />
        </section>
        <section className="item-list">
          <SimpleBar style={{ minHeight: 0, display: 'flex' }}>
            <LoadingOverlay visible={dataState.storage.loading} overlayBlur={2} />
            <ul className="storages">
              {dataState.storage.list?.map((storage: Storage) => (
                <li className="storage-li-item" key={storage.id} onClick={onSelectStorage.bind(null, storage)} onDoubleClick={storagesToolbarAction.bind(null, 'edit')}>
                  <StorageCard value={storage} selected={dataState.storage.selected?.id === storage.id} />
                </li>
              ))}
            </ul>
            <div className="actions d-flex">
              <button className="btn btn-outline btn-large btn-brand m-3 flex-grow-1 fw-medium caption-12" style={{ padding: '12px' }} onClick={storagesToolbarAction.bind(null, 'add')}>
                {translate('+_ADD_NEW_STORAGE')}
              </button>
            </div>
          </SimpleBar>
        </section>
      </div>
      {(state.mode === 'add' || state.mode === 'edit') && <StorageAdd opened={!!state.mode} closed={(): void => onModalClosed()} edit={state.mode} storage={dataState.storage.selected} />}
      {!!dataState.storage.selected && state.mode === 'delete' && <StorageDelete opened={!!state.mode} closed={onModalClosed} storage={dataState.storage.selected} />}
    </>
  );
});
