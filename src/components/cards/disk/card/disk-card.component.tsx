import './disk-card.component.scss';

import React from 'react';

export interface Disk {
  id: string;
  name: string;
  diskSize: string;
  diskType: 'Cache' | 'Data' | 'Log';
  status: 'ONLINE' | 'OFFLINE';
  createdDate: string;
  lastModifiedDate: string;
  storageId: string;
  poolId: string;
  chassisId: string;
  chassisName: string;
}

export interface DiskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: Disk;
  selected: boolean;
}

export const DiskCard = ({ value, selected, ...rest }: DiskCardProps): React.JSX.Element => (
  <div className={`disk-card d-flex flex-column gap-2 p-3 flex-grow-1 ${selected && 'selected'}`} {...rest}>
    <header className="d-flex flex-column gap-1">
      <h4 className="caption-16 fw-semibold d-flex gap-2">
        {value?.name}
        <span className={`mt-1 ${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
      </h4>
      <aside className="d-flex gap-1 caption-10">
        <span className="fw-bold">{value.diskSize}</span>
        <span className="fw-bold">•</span>
        <span className="fw-regular">{value.diskType}</span>
      </aside>
    </header>
    <section className="body d-flex">
      <span className="storage-right caption-10 fw-light gap-1 d-flex">{value.chassisName}</span>
    </section>
  </div>
);
