import { LoadingOverlay, Menu, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowsLeftRight, IconEdit, IconFilter, IconMessageCircle, IconPhoto, IconPlus, IconSearch, IconSettings, IconSortAscending, IconSortDescending, IconTrash, IconX } from '@tabler/icons-react';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector, useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { HttpResponse } from 'src/components/authentication/dto';
import { HostAdd } from 'src/components/cards/host/add/host-add.components';
import { Host, HostCard } from 'src/components/cards/host/card/host-card.component';
import { HostDelete } from 'src/components/cards/host/delete/host-delete.components';
import { useTranslate } from 'src/components/translate/translate.component';
import useTextTransform from 'src/hooks/case';
import { set_app_header } from 'src/store/reducers/app.reducer';
import { DataState, set_hosts } from 'src/store/reducers/data.reducer';
import { RootState } from 'src/store/store';

export type ToolbarActions = 'add' | 'edit' | 'delete' | null;

export interface ListRef {
  sortingClick: (state: boolean) => void;
  toolbarAction: (type: ToolbarActions) => void;
  state: HostState;
}

export interface HostProps {}

export interface HostState {
  mode: ToolbarActions;
}

export const HostList = forwardRef<ListRef, HostProps>((props, ref): React.ReactElement => {
  const { translate } = useTranslate();
  const { titleCase } = useTextTransform();
  const navigate = useNavigate();
  const store = useStore();
  const dataState = useSelector<RootState>((state): DataState => state.dataStore) as DataState;
  const [query, setQuery] = React.useState<string>('');
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [sorting, setSorting] = useState(false);
  const [state, setState] = useState<HostState>({
    mode: null,
  });
  const { hostId } = useParams();
  const hostsToolbarAction = (type: ToolbarActions): void => {
    setState({ ...state, mode: type });
  };
  const onModalClosed = (): void => {
    setState(() => ({ ...state, mode: null }));
  };
  const getHostList = (sorting: boolean = false): void => {
    // TODO: çoklu sort şu şekilde yapılıyormuş  -->   ?page=0&size=10&sort=name,desc&sort=port,asc
    const params = { page: '0', size: '50', sort: ['name', `${sorting ? 'asc' : 'desc'}`].join(',') };

    store.dispatch(set_hosts({ list: [], selected: null, loading: true }));
    api
      .post('/host/search', {}, { params })
      .then((items: AxiosResponse<HttpResponse<Host[]>>) => {
        const Hosts = items.data.data;

        store.dispatch(set_hosts({ loading: false }));
        // eslint-disable-next-line max-len
        store.dispatch(set_hosts(Hosts.length > 0 ? { list: Hosts, selected: hostId ? Hosts.find((host) => host.id === hostId) || null : Hosts[0] } : { list: [], selected: null }));
        !hostId && navigate(Hosts.length > 0 ? '/host/' + Hosts[0].id : '/host/empty');
      })
      .catch((error) => {
        store.dispatch(set_hosts({ list: [], selected: null, loading: false }));
        !hostId && navigate('/host/empty');
        notifications.show({
          title: translate('FAIL'),
          autoClose: false,
          message: error.response?.data.message || translate('API_HOST_LIST_FAIL'),
          color: 'danger.3',
        });
      });
  };

  useImperativeHandle(ref, () => ({
    sortingClick: (sorting) => getHostList(sorting),
    toolbarAction: (type: ToolbarActions) => hostsToolbarAction(type),
    state,
  }));

  useEffect(() => {
    if (state.mode === null) {
      getHostList();
    }
  }, [state.mode]);

  useEffect(() => {
    if (dataState.host.selected) {
      // TODO: add set header hook
      store.dispatch(
        set_app_header({
          title: titleCase(dataState.host.selected.name),
          label: translate('CREATED'),
          value: `${dayjs(dataState.host.selected.createdDate).format('MMMM D, YYYY h:mm A')}`,
        }),
      );
    }
  }, [dataState.host.selected]);

  const onSelectHost = (host: Host): void => {
    store.dispatch(set_hosts({ list: dataState.host.list, selected: host, loading: false }));
    navigate('/host/' + host.id);
  };

  return (
    <>
      <div className="list-items-container">
        <section className="list-items-header px-3">
          <h2 className="h2 fw-extra-bold secondary-500">{translate('HOSTS')}</h2>
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
          <button className="btn btn-brand btn-ghost btn-xs" onClick={hostsToolbarAction.bind(null, 'delete')}>
            <IconTrash size={16} />
          </button>
          <button
            className={`btn btn-brand btn-ghost btn-xs`}
            onClick={(): void => {
              setSorting(() => !sorting);
              getHostList();
            }}
          >
            {sorting ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
          </button>
          <button className={`btn btn-brand btn-ghost btn-xs`} onClick={hostsToolbarAction.bind(null, 'edit')}>
            <IconEdit size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-xs" onClick={hostsToolbarAction.bind(null, 'add')}>
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
            <LoadingOverlay visible={dataState.host.loading} overlayBlur={2} />
            <ul className="storages">
              {dataState.host.list?.map((host: Host) => (
                <li className="storage-li-item" key={host.id} onClick={onSelectHost.bind(null, host)} onDoubleClick={hostsToolbarAction.bind(null, 'edit')}>
                  <HostCard value={host} selected={dataState.host.selected?.id === host.id} />
                </li>
              ))}
            </ul>
            <div className="actions d-flex">
              <button className="btn btn-outline btn-large btn-brand m-3 flex-grow-1 fw-medium caption-12" style={{ padding: '12px' }} onClick={hostsToolbarAction.bind(null, 'add')}>
                {translate('+_ADD_NEW_STORAGE')}
              </button>
            </div>
          </SimpleBar>
        </section>
      </div>
      {(state.mode === 'add' || state.mode === 'edit') && <HostAdd opened={!!state.mode} closed={(): void => onModalClosed()} edit={state.mode} host={dataState.host.selected} />}
      {!!dataState.host.selected && state.mode === 'delete' && <HostDelete opened={!!state.mode} closed={onModalClosed} host={dataState.host.selected} />}
    </>
  );
});
