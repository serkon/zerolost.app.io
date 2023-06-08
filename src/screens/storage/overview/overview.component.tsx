import './overview.component.scss';

import { Menu,Text, TextInput } from '@mantine/core';
import { IconArrowsLeftRight, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash, IconX } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { useTranslate } from 'src/components/translate/translate.component';

import Storages from './storage.sample.json';

export const ScreenStorageOverview = (): React.ReactElement => {
  const { translate } = useTranslate();
  const { parametreAdi } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState<string>('');
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);
  const [storages, setStorages] = React.useState<Storage[]>();

  useEffect(() => {
    setStorages(Storages);
    console.log('parametre', parametreAdi);
  }, []);

  return (
    <>
      <div className="list-items">
        <section className="header px-3">
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
              <Menu.Item icon={<IconSearch size={14} />} rightSection={<Text size="xs" color="dimmed">⌘K</Text>}>Search</Menu.Item>
              <Menu.Divider />
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
              <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <button className={`btn btn-brand btn-${!filterOpen ? 'ghost':''} btn-xs ti-filter`} onClick={():void => setFilterOpen(!filterOpen)} />
          <button className="btn btn-brand btn-ghost btn-xs ti-sort-descending" />
          <button className="btn btn-brand btn-ghost btn-xs ti-plus" />
        </section>
        <section className={`search d-flex px-3 flex-column ${!filterOpen && 'd-none'}`}>
          <TextInput
            size="sm"
            icon={<IconSearch size={16} />}
            placeholder={translate('SEARCH')}
            value={query}
            onChange={(e):void => setQuery(e.currentTarget.value)}
            rightSection={
              query ? (
                <IconX
                  size={16}
                  style={{
                    display: 'block',
                    opacity: 0.5,
                    cursor: 'pointer',
                  }}
                  onClick={():void => setQuery('')}
                />
              ) : null
            }
          />
        </section>
        <section className="list">
          <SimpleBar style={{ minHeight: 0, display: 'flex' }} >
            <ul className="storages">
              {storages?.map((storage:Storage) => (
                <li key={storage.ip} className="item">
                  <StorageCard value={storage} />
                </li>
              ))}
            </ul>
            <div className="actions d-flex">
              <button className="btn btn-outline btn-large btn-brand m-3 flex-grow-1 fw-medium caption-12" style={{ padding: '12px'}}>+ Add New Storage</button>
            </div>
          </SimpleBar>
        </section>
      </div>
      <div>dsadad</div>
    </>
  );
};

interface Storage {
  id?: string;
  name: string;
  ip: string;
  model: string; // Sun Storage VMware, Pure Storage,
  type?: string; // ZFSSA, Secondary Storage
  version: string;
  port: number;
  username: string;
  password: string;
  healthy: boolean;
  disk: {
    size: string;
    used: string;
    percentage: number;
    system: number;
    data: number;
    cache: number;
    log: number;
  }
}

const StorageCard = ({value}: { value: Storage }): React.ReactElement => {
  const [data, setData] = useState('');

  return (
    <section className="storage d-flex flex-column gap-4">
      <header className="d-flex flex-column gap-1">
        <h4 className="h4 fw-bold secondary-600">{value.name}</h4>
        <aside className="d-flex caption-14 secondary-300 gap-1">
          <span className="">{value.ip}</span><span className="secondary-500">•</span><span className="fw-bold">{value.model}</span>
        </aside>
      </header>
      <section className="body d-flex flex-column gap-2">
        <aside className="d-flex">
          <span className="storage-left caption-10 secondary-500 flex-grow-1">{value.disk.percentage}%</span>
          <span className="storage-right secondary-500 gap-1 d-flex">
            <span className="caption-10 fw-light">{value.disk.used}</span>
            <span className="caption-10 fw-ligh">•</span>
            <span className="caption-10 fw-medium">{value.disk.size}</span>
          </span>
        </aside>
        <aside className="d-flex gap-1">
          <span className={`disk-used ${value.disk.percentage >= 90 ? 'bg-danger-500': value.disk.percentage >= 80 ? 'bg-warning-500': 'bg-success-500'}`} style={{flexBasis: value.disk.percentage + '%'}} />
          <span className="disk-size" style={{flexBasis: 100 - value.disk.percentage + '%'}} />
        </aside>
      </section>
      <footer className="d-flex gap-2">
        {
          <aside className="d-flex gap-1 caption-10 secondary-300 d-flex flex-grow-1">
            <span className="disk-system fw-bold">{value.disk.system} system disk</span>
            <span className="secondary-500 fw-bold">•</span>
            <span className="disk-data fw-regular">{value.disk.data} data disk</span>
          </aside>
        }
        {
        /*
        <aside className="d-flex gap-1 caption-10 secondary-300">
          <span className="disk-system fw-bold">System</span>
          <span className="secondary-500 fw-bold">•</span>
          <span className="disk-data fw-regular">{value.disk.system}</span>
        </aside>
        <aside className="d-flex gap-1 caption-10 secondary-300 flex-grow-1">
          <span className="disk-system fw-bold">Data</span>
          <span className="secondary-500 fw-bold">•</span>
          <span className="disk-data fw-regular">{value.disk.data}</span>
        </aside>
        */
        }
        <aside className="d-flex gap-1 caption-10 secondary-300">
          <span className="disk-system fw-bold">Cache</span>
          <span className="secondary-500 fw-bold">•</span>
          <span className="disk-data fw-regular">{value.disk.cache} disk</span>
        </aside>
        <aside className="d-flex gap-1 caption-10 secondary-300">
          <span className="disk-system fw-bold">Log</span>
          <span className="secondary-500 fw-bold">•</span>
          <span className="disk-data fw-regular">{value.disk.log} disk</span>
        </aside>
      </footer>
    </section>
  );
};
