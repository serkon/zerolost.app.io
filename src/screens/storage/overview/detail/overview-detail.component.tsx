import './overview-detail.component.scss';

import { useParams } from 'react-router-dom';
import { PoolList } from 'src/components/cards/pool/pool-list.component';
import { useTranslate } from 'src/components/translate/translate.component';

export const ScreenStorageOverviewDetail = (): React.ReactElement => {
  const { translate } = useTranslate();
  const { storageId } = useParams();

  return (
    <>
      ---{storageId}----
      <p className="body-16 px-4 secondary-400 m-0">{translate('STORAGE_DESCRIPTION')}</p>
      {storageId && (
        <>
          <PoolList storage={storageId} />
        </>
      )}
    </>
  );
};
