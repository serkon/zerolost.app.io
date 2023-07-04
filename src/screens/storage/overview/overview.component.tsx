import './overview.component.scss';

import { Menu, Text, TextInput } from '@mantine/core';
import { IconArrowsLeftRight, IconEdit, IconFilter, IconMessageCircle, IconPhoto, IconPlus, IconSearch, IconSettings, IconSortAscending, IconSortDescending, IconTrash, IconX } from '@tabler/icons-react';
import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { PoolList } from 'src/components/cards/pool/list/pool-list.component';
import { ListRef, StorageList, ToolbarActions } from 'src/components/cards/storage/list/storage-list.component';
import { Header } from 'src/components/header/header.component';
import { useTranslate } from 'src/components/translate/translate.component';

export const ScreenStorageOverview = (): React.ReactElement => {
  const { translate } = useTranslate();
  const { storageId } = useParams();
  const [query, setQuery] = React.useState<string>('');
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [sorting, setSorting] = useState(false);
  const listRef = useRef<ListRef>(null);
  const handleSortingClick = (): void => {
    if (listRef.current) {
      setSorting(!sorting);
      listRef.current.sortingClick(!sorting);
    }
  };
  const handleAddClick = (type: ToolbarActions): void => {
    if (listRef.current) {
      listRef.current.toolbarAction(type);
    }
  };
  const handleScroll = (e: any): void => {
    setScrolled(e.target.scrollTop > 0);
  };

  return (
    <>
      <div className="list-items-container">
        <section className="list-items-header px-3">
          <h2 className="h2 fw-extra-bold secondary-500">{translate('STORAGES')}</h2>
          <p className="m-0 secondary-400 fw-light caption-14">{translate('STORAGES_SLOGAN')}</p>
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
          <button className="btn btn-brand btn-ghost btn-xs" onClick={handleAddClick.bind(null, 'delete')}>
            <IconTrash size={16} />
          </button>
          <button className={`btn btn-brand btn-ghost btn-xs`} onClick={handleSortingClick}>
            {sorting ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
          </button>
          <button className={`btn btn-brand btn-ghost btn-xs`} onClick={handleAddClick.bind(null, 'edit')}>
            <IconEdit size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-xs" onClick={handleAddClick.bind(null, 'add')}>
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
            <StorageList ref={listRef} />
            <div className="actions d-flex">
              <button className="btn btn-outline btn-large btn-brand m-3 flex-grow-1 fw-medium caption-12" style={{ padding: '12px' }} onClick={handleAddClick.bind(null, 'add')}>
                {translate('ADD_NEW_STORAGE')}
              </button>
            </div>
          </SimpleBar>
        </section>
      </div>
      <div className={`screen-detail-container d-flex flex-column gap-4 pb-5`} onScroll={handleScroll}>
        <Header className={`scrollable-element ${scrolled ? 'scrolled' : ''}`} />
        <p className="body-16 px-4 secondary-400 m-0">{translate('STORAGE_DESCRIPTION')}</p>
        {storageId && <PoolList />}
      </div>
    </>
  );
};

export const More = (): React.ReactElement => {
  const { translate } = useTranslate();
  const onClickHandler = useCallback((): void => {
    console.log('sad');
  }, []);

  return (
    <div className={`pool-card card-more dash align-items-center justify-content-center`} onClick={onClickHandler}>
      <span className="d-flex flex-grow-0 flex-shring-1 brand-500 caption-12 fw-medium">{translate('MORE_WITH_COUNT', { count: 5 })}</span>
    </div>
  );
};
