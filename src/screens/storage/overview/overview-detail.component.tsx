import { useParams } from 'react-router-dom';
import { DiskList } from 'src/components/cards/disk/disk-card.component';
import { LuneList } from 'src/components/cards/lune/lune-card.component';
import { PoolList } from 'src/components/cards/pool/pool-card.component';
import { useTranslate } from 'src/components/translate/translate.component';

export const ScreenStorageOverviewDetail = (): React.ReactElement => {
  const { translate } = useTranslate();
  const { parametreAdi } = useParams();

  return (
    <>
      ---{parametreAdi}----
      <p className="body-16 px-4 secondary-400 m-0">{translate('STORAGE_DESCRIPTION')}</p>
      <PoolList />
      <DiskList />
      <LuneList />
    </>
  );
};
