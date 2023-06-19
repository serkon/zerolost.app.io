import './storage-card.component.scss';

import React, { useEffect, useState } from 'react';
import { AppConfig } from 'src/app.config';
import { useTranslate } from 'src/components/translate/translate.component';
import useTextTransform from 'src/hooks/case';

export interface Storage {
  createdDate: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  ipAddress: string;
  port: string;
  model: string; // Sun Storage VMware, Pure Storage,
  storageType: string; // ZFSSA, Secondary Storage
  storageVersion: string;
  username: string;
  password: string;
  status: 'ONLINE' | 'OFFLINE';
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

export const StorageCard = ({ value, selected }: { value: Storage; selected: boolean }): React.ReactElement => {
  const { translate } = useTranslate();
  const { titleCase } = useTextTransform();
  const [storage, setStorage] = useState(value);

  useEffect(() => {
    setStorage(value);
  }, [value]);

  return (
    <div className={`storage-card d-flex flex-column gap-4 ${selected && 'selected'}`}>
      <header className="d-flex flex-column gap-1">
        <h4 className="h4 fw-extra-bold secondary-600 d-flex align-items-center gap-2">
          {titleCase(storage.name)}
          <span className={`mt-1 ${storage.status === 'ONLINE' ? 'online' : 'offline'}`} />
        </h4>
        <aside className="d-flex caption-12 secondary-300 gap-1">
          <span className="">
            {storage.ipAddress}:{storage.port}
          </span>
          <span className="secondary-500">•</span>
          <span className="fw-bold">{translate(storage.storageType + '_STORAGE')}</span>
        </aside>
      </header>
      <section className="body d-flex flex-column gap-2">
        <aside className="d-flex">
          <span className="storage-left caption-10 secondary-500 flex-grow-1">{storage.disk.percentage}%</span>
          <span className="storage-right secondary-500 gap-1 d-flex">
            <span className="caption-10 fw-light">{storage.disk.used}</span>
            <span className="caption-10 fw-ligh">•</span>
            <span className="caption-10 fw-medium">{storage.disk.size}</span>
          </span>
        </aside>
        <aside className="d-flex gap-1">
          <span
            className={`disk-used ${storage.disk.percentage >= AppConfig.storage.thresholds.danger ? 'bg-danger-500' : storage.disk.percentage >= AppConfig.storage.thresholds.warning ? 'bg-warning-500' : 'bg-success-500'}`}
            style={{ flexBasis: storage.disk.percentage + '%' }}
          />
          <span className="disk-size" style={{ flexBasis: 100 - storage.disk.percentage + '%' }} />
        </aside>
      </section>
      <footer className="d-flex gap-2">
        {
          <aside className="d-flex gap-1 caption-10 secondary-300 d-flex flex-grow-1">
            <span className="disk-system fw-bold">{storage.disk.system} system disk</span>
            <span className="secondary-500 fw-bold">•</span>
            <span className="disk-data fw-regular">{storage.disk.data} data disk</span>
          </aside>
        }
        <aside className="d-flex gap-1 caption-10 secondary-300">
          <span className="disk-system fw-bold">Cache</span>
          <span className="secondary-500 fw-bold">•</span>
          <span className="disk-data fw-regular">{storage.disk.cache} disk</span>
        </aside>
        <aside className="d-flex gap-1 caption-10 secondary-300">
          <span className="disk-system fw-bold">Log</span>
          <span className="secondary-500 fw-bold">•</span>
          <span className="disk-data fw-regular">{storage.disk.log} disk</span>
        </aside>
      </footer>
    </div>
  );
};
