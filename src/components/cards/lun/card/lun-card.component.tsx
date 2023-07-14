import './lun-card.component.scss';

import { useTranslate } from 'src/components/translate/translate.component';

export interface Lun {
  lastModifiedDate: string;
  createdDate: string;
  id: string;
  name: string;
  size: string;
  ratio: string;
  poolId: string;
  status: 'ONLINE' | 'OFFLINE';
  guid: string;
  compression: string;
  mount: string;
  host: string;
}

export interface LunCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: Lun;
  selected: boolean;
}

export const LunCard = ({ value, selected, ...rest }: LunCardProps): React.JSX.Element => {
  const { translate } = useTranslate();

  return (
    <div className={`lun-card d-flex flex-column gap-3 p-3 ${selected && 'selected'}`} {...rest}>
      <header className="d-flex flex-column">
        <h4 className="caption-16 fw-semibold d-flex gap-2 align-items-center">
          <span className="text-truncate lh-sm">{value?.name}</span>
          <span className={`${value.status === 'ONLINE' ? 'online' : 'offline'}`} />
        </h4>
        <div className="sub d-flex align-items-center gap-2 caption-10">
          <aside className="d-flex gap-1 caption-10">
            <span className="fw-bold">{translate('SIZE')}</span>
            <span className="fw-light">{value.size}</span>
          </aside>
          <span className="fw-bold">•</span>
          <aside className="d-flex gap-1 caption-10">
            <span className="fw-bold">{translate('COMPRESS')}</span>
            <span className="fw-light">{value.compression}</span>
          </aside>
          <span className="fw-bold">•</span>
          <aside className="d-flex gap-1 caption-10">
            <span className="fw-bold">{translate('RATIO')}</span>
            <span className="fw-light">{value.ratio}</span>
          </aside>
        </div>
      </header>
      <section className="body d-flex">
        <aside className={`card-value-item d-flex flex-column gap-1 divider`}>
          <span className="title caption-12 fw-semibold flex-grow-1 text-nowrap">{translate('MOUNTED')}</span>
          <span className="caption-10 fw-regular d-flex text-nowrap truncate">{value.mount}</span>
        </aside>
        <aside className={`card-value-item d-flex flex-column gap-1`}>
          <span className="title caption-12 fw-semibold flex-grow-1 text-nowrap">{translate('HOST')}</span>
          <span className="caption-10 fw-regular d-flex text-nowrap truncate">{value.host}</span>
        </aside>
      </section>
    </div>
  );
};
