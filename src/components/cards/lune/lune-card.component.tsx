import './lune-card.component.scss';

import { TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { useTranslate } from 'src/components/translate/translate.component';
import { More } from 'src/screens/storage/overview/overview.component';

import Lunes from './lune.sample.json';

export const LuneCard = ({ value }: { value: Lune }): React.JSX.Element => {
  const { translate } = useTranslate();
  const [select, setSelect] = useState<string[]>([]);
  const [diskCount, setDiskCount] = useState(0);
  const onClickHandler = useCallback(
    (value: Lune): void => {
      select.includes(value.id) ? setSelect(select.filter((id) => id !== value.id)) : setSelect([...select, value.id]);
    },
    [select],
  );

  return (
    <div className={`lune-card d-flex flex-column gap-3 p-3 ${select.includes(value.id) ? 'selected' : 'secondary-400'}`} onClick={onClickHandler.bind(null, value)}>
      <header className="d-flex flex-column gap-1">
        <h4 className="caption-16 fw-semibold d-flex gap-2 align-items-center">
          <span className="text-truncate lh-sm">{value?.name}</span>
          <span className={`${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
        </h4>
        <aside className="d-flex gap-1 caption-10">
          <span className="fw-bold">{value.size}</span>
          <span className="fw-bold">•</span>
          <span className="fw-regular">{translate('VOLUME_SIZE')}</span>
        </aside>
      </header>
      <section className="body d-flex">
        <aside className={`card-value-item d-flex flex-column gap-1 divider`}>
          <span className="title caption-12 fw-semibold flex-grow-1 text-nowrap">{translate('COMPRESSION')}</span>
          <span className="caption-10 fw-regular d-flex text-nowrap">{value.compression}</span>
        </aside>
        <aside className={`card-value-item d-flex flex-column gap-1 divider`}>
          <span className="title caption-12 fw-semibold flex-grow-1 text-nowrap">{translate('MOUNTED')}</span>
          <span className="caption-10 fw-regular d-flex text-nowrap">{value.mount}</span>
        </aside>
        <aside className={`card-value-item d-flex flex-column gap-1`}>
          <span className="title caption-12 fw-semibold flex-grow-1 text-nowrap">{translate('HOST')}</span>
          <span className="caption-10 fw-regular d-flex text-nowrap">{value.host}</span>
        </aside>
      </section>
    </div>
  );
};

export const LuneList = (): React.ReactElement => {
  const { translate } = useTranslate();

  return (
    <>
      <div className="filter-area px-4 d-flex align-items-center">
        <h5 className="fw-extra-bold secondary-600 flex-grow-1">
          <span>{translate('LUNES_ON_SELECTED_POOL')}</span>
        </h5>
        {/* <input type="text" className="form-control form-control-sm w-25" placeholder={translate('SEARCH')} /> */}
        <TextInput type="text" placeholder={translate('SEARCH_IN_LUNES')} name="filter" size="sm" icon={<IconSearch size={16} />} className="me-2 filter-shadow" />
        <div className="d-flex">
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconTrash size={16} />
          </button>
          <button className="btn btn-brand btn-ghost btn-sm">
            <IconPlus size={16} />
          </button>
        </div>
      </div>
      <div className="lune-card-list mx-4">
        {Lunes.map((pool: any) => (
          <LuneCard value={pool} key={pool.id} />
        ))}
        <More />
      </div>
    </>
  );
};

export interface Lune {
  lastModifiedDate: string;
  createdDate: string;
  id: string;
  name: string;
  size: string;
  poolId: string;
  status: 'ONLINE' | 'OFFLINE';
  guid: string;
  compression: string;
  mount: string;
  host: string;
}
