import './storage-card.component.scss';

import React, { useEffect } from 'react';
import { AppConfig } from 'src/app.config';

import Storages from './storage.sample.json';

export interface Storage {
  id: string;
  name: string;
  ip: string;
  model: string; // Sun Storage VMware, Pure Storage,
  type?: string; // ZFSSA, Secondary Storage
  version: string;
  port: number;
  username: string;
  password: string;
  status: string;
  disk: {
    size: string;
    used: string;
    percentage: number;
    system: number;
    data: number;
    cache: number;
    log: number;
  };
}

export const StorageCard = ({ value }: { value: Storage }): React.ReactElement => (
  <div className={`storage-card d-flex flex-column gap-4 ${value.ip === '192.168.0.1' && 'selected'}`}>
    <header className="d-flex flex-column gap-1">
      <h4 className="h4 fw-extra-bold secondary-600 d-flex align-items-center gap-2">
        {value.name}
        <span className={`mt-1 ${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
      </h4>
      <aside className="d-flex caption-14 secondary-300 gap-1">
        <span className="">{value.ip}</span>
        <span className="secondary-500">•</span>
        <span className="fw-bold">{value.model}</span>
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
        <span className={`disk-used ${value.disk.percentage >= AppConfig.storage.thresholds.danger ? 'bg-danger-500' : value.disk.percentage >= AppConfig.storage.thresholds.warning ? 'bg-warning-500' : 'bg-success-500'}`} style={{ flexBasis: value.disk.percentage + '%' }} />
        <span className="disk-size" style={{ flexBasis: 100 - value.disk.percentage + '%' }} />
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
  </div>
);

export const StorageList = (): React.ReactElement => {
  const [storages, setStorages] = React.useState<Storage[]>();

  useEffect(() => {
    setStorages(Storages);
  }, []);

  return (
    <ul className="storages">
      {storages?.map((storage: Storage) => (
        <li key={storage.ip} className="item">
          <StorageCard value={storage} />
        </li>
      ))}
    </ul>
  );
};
