import './overview.component.scss';

import { Menu, Text, TextInput } from '@mantine/core';
import { IconArrowsLeftRight, IconMessageCircle, IconPhoto, IconPlus, IconSearch, IconSettings, IconTrash, IconX } from '@tabler/icons-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { DiskList } from 'src/components/cards/disk-card.component';
import { PoolCard } from 'src/components/cards/pool-card.component';
import { Storage, StorageCard } from 'src/components/cards/storage-card.component';
import { Header } from 'src/components/header/header.component';
import { useTranslate } from 'src/components/translate/translate.component';

import Pools from './pool.sample.json';
import Storages from './storage.sample.json';

export const ScreenStorageOverview = (): React.ReactElement => {
  const { translate } = useTranslate();
  const { parametreAdi } = useParams();
  const [query, setQuery] = React.useState<string>('');
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [storages, setStorages] = React.useState<Storage[]>();
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = (e: any): void => {
    if (e.target.scrollTop > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    setStorages(Storages);
    console.log('parametre', parametreAdi);
  }, []);

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
          <button className="btn btn-brand btn-ghost btn-xs ti-sort-descending" />
          <button className="btn btn-brand btn-ghost btn-xs ti-plus" />
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
            <ul className="storages">
              {storages?.map((storage: Storage) => (
                <li key={storage.ip} className="item">
                  <StorageCard value={storage} />
                </li>
              ))}
            </ul>
            <div className="actions d-flex">
              <button className="btn btn-outline btn-large btn-brand m-3 flex-grow-1 fw-medium caption-12" style={{ padding: '12px' }}>
                + Add New Storage
              </button>
            </div>
          </SimpleBar>
        </section>
      </div>
      <div className={`screen-detail-container d-flex flex-column gap-4 pb-5`} onScroll={handleScroll}>
        <Header className={`scrollable-element ${scrolled ? 'scrolled' : ''}`} />
        <p className="body-16 px-4 secondary-400 m-0">{translate('STORAGE_DESCRIPTION')}</p>
        <div className="filter-area px-4 d-flex align-items-center">
          <h5 className="fw-extra-bold secondary-600 flex-grow-1">
            <span>{translate('AVAILABLE_POOLS')}</span>
          </h5>
          {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
          <TextInput type="text" placeholder={translate('SEARCH_IN_POOL')} name="filter" size="sm" icon={<IconSearch size={16} />} className="me-2 filter-shadow" />
          <div className="d-flex">
            <button className="btn btn-brand btn-ghost btn-sm">
              <IconTrash size={16} />
            </button>
            <button className="btn btn-brand btn-ghost btn-sm">
              <IconPlus size={16} />
            </button>
          </div>
        </div>
        <div className="card-list mx-4">
          {Pools.map((pool: any) => (
            <PoolCard value={pool} key={pool.id} />
          ))}
          <More />
        </div>
        <DiskList />
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
