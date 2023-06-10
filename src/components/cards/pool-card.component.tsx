import './pool-card.component.scss';

import { useCallback, useState } from 'react';

interface Pool {
  createdDate: string;
  lastModifiedDate: string;
  id: string;
  name: string;
  dataProfile: string;
  logProfile: string;
  diskSize: string;
  diskUsed: string;
  diskCount: number;
  status: 'ONLINE' | 'OFFLINE';
  storageId: string;
}

export const PoolCard = ({ value }: { value: Pool }): React.JSX.Element => {
  const [select, setSelect] = useState<string[]>([]);
  const onClickHandler = useCallback(
    (value: Pool): void => {
      select.includes(value.id) ? setSelect(select.filter((id) => id !== value.id)) : setSelect([...select, value.id]);
    },
    [select],
  );

  return (
    <div className={`pool-card d-flex flex-column gap-4 p-3 flex-grow-1 ${select.includes(value.id) ? 'selected' : 'secondary-400'}`} onClick={onClickHandler.bind(null, value)}>
      <header className="d-flex flex-column gap-1">
        <h4 className="caption-16 fw-semibold d-flex gap-2">
          <span className="text-truncate lh-sm">{value?.name}</span>
          <span className={`mt-1 ${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
        </h4>
        <aside className="d-flex caption-10 gap-1">
          <span className="fw-light">
            {value.diskUsed}/{value.diskSize}
          </span>
        </aside>
      </header>
      <section className="body d-flex">
        <aside className="d-flex flex-column gap-1 divider">
          <span className="storage-left caption-12 fw-semibold flex-grow-1 text-nowrap">Log Profile</span>
          <span className="storage-right caption-10 fw-light gap-1 d-flex text-nowrap">{value.logProfile}</span>
        </aside>
        <aside className="d-flex flex-column gap-1">
          <span className="storage-left caption-12 fw-semibold flex-grow-1 text-nowrap">Data Profile</span>
          <span className="storage-right caption-10 fw-light gap-1 d-flex text-nowrap">{value.dataProfile}</span>
        </aside>
      </section>
    </div>
  );
};
