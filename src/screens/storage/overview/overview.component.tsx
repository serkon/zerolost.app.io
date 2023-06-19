import './overview.component.scss';

import { Menu, Text, TextInput } from '@mantine/core';
import { IconArrowsLeftRight, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash, IconX } from '@tabler/icons-react';
import React, { useCallback, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { ListRef, StorageList } from 'src/components/cards/storage/list/storage-list.component';
import { Header } from 'src/components/header/header.component';
import { useTranslate } from 'src/components/translate/translate.component';

export const ScreenStorageOverview = (): React.ReactElement => {
  const { translate } = useTranslate();
  const [query, setQuery] = React.useState<string>('');
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [sorting, setSorting] = useState(false);
  const listRef = useRef<ListRef>(null);
  const handleSortingClick = (): void => {
    if (listRef.current) {
      setSorting(!sorting);
      listRef.current.sortingClick(!sorting);
    }
  };
  const handleAddClick = (type: 'add' | 'edit'): void => {
    if (listRef.current) {
      listRef.current.toolbarAction(type);
    }
  };
  const handleScroll = (e: any): void => {
    setScrolled(e.target.scrollTop > 0);
  };
  const toggle = (): void => {
    console.log('toggle');
    setAdd(!add);
  };
  const close = (): void => {
    console.log('close');
    setAdd(!add);
  };

  return (
    <>
      <div className="list-items-container">
        <section className="list-items-header px-3">
          <h2 className="h2 fw-extra-bold secondary-500">Storage</h2>
          <p className="m-0 secondary-400 fw-light caption-14">No data will be lost, never you will be code</p>
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
          <button className={`btn btn-brand btn-${!filterOpen ? 'ghost' : ''} btn-xs ti-filter`} onClick={(): void => setFilterOpen(!filterOpen)} />
          <button className={`btn btn-brand btn-ghost btn-xs ${sorting ? 'ti-sort-ascending' : 'ti-sort-descending'}`} onClick={handleSortingClick} />
          <button className={`btn btn-brand btn-ghost btn-xs ti-edit`} onClick={handleAddClick.bind(null, 'edit')} />
          <button className="btn btn-brand btn-ghost btn-xs ti-plus" onClick={handleAddClick.bind(null, 'add')} />
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
        <Outlet />
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
