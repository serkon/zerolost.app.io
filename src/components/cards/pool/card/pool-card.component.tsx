import './pool-card.component.scss';

import { useEffect, useState } from 'react';
import { useTranslate } from 'src/components/translate/translate.component';

interface PoolCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: Pool;
  selected: boolean;
}

export const PoolCard = ({ value, selected, ...rest }: PoolCardProps): React.JSX.Element => {
  const { translate } = useTranslate();
  const [diskCount, setDiskCount] = useState(0);

  useEffect(() => {
    setDiskCount(value.disks.reduce((sum, val) => sum + val.count, 0));
  }, [value]);

  return (
    <div className={`pool-card d-flex flex-column gap-3 p-3 ${selected && 'selected'}`} {...rest}>
      <header className="d-flex flex-column gap-1">
        <h4 className="caption-16 fw-semibold d-flex gap-2 align-items-center">
          <span className="text-truncate lh-sm">{value?.name}</span>
          <span className={`${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
          <span className="d-flex ms-auto caption-10 fw-semibold circle align-items-center justify-content-center">{diskCount}</span>
        </h4>
        <aside className="d-flex gap-1 caption-10">
          <span className="fw-light">{translate('USAGE_SNAPSHOT')}</span>
          <span className="fw-bold">•</span>
          <span className="fw-light">{value.usageSnapshot ? value.usageSnapshot : 'N/A'}</span>
        </aside>
      </header>
      <section className="body d-flex">
        {value.disks.map((disk: PoolDisk, key: number) => (
          <aside className={`card-value-item d-flex flex-column gap-1 ${key < value.disks.length - 1 ? 'divider' : ''}`} key={key}>
            <span className="title caption-12 fw-semibold flex-grow-1 text-nowrap">{translate('POOL_DISK_TYPE_' + disk.type)}</span>
            <span className="caption-10 fw-regular d-flex text-nowrap">{translate('DISKS.' + disk.profile)}</span>
            <span className="caption-10 fw-light d-flex text-nowrap">
              {disk.used} / {disk.size}
            </span>
          </aside>
        ))}
      </section>
    </div>
  );
};

export interface Pool {
  id: string;
  name: string;
  storageId: string;
  status: string; // ONLINE | OFFLINE
  lastModifiedDate: string;
  createdDate: string;
  usageSnapshot: string;
  disks: PoolDisk[];
}

export type Profile = 'mirror' | 'mirror3' | 'raidz1' | 'raidz2' | 'raidz3_max' | 'stripe';
export interface PoolDisk {
  type: 'data' | 'log' | 'cache';
  profile: Profile;
  size: string;
  used: string;
  percentage: number;
  count: number;
}
