import { Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { Pool, Profile } from 'src/components/cards/pool/card/pool-card.component';
import { Option } from 'src/components/multiselect/multiselect.component';
import { useTranslate } from 'src/components/translate/translate.component';
import * as Yup from 'yup';

interface PoolDeleteProps {
  opened: boolean;
  closed: () => void;
  pool: Pool;
}

interface FormItems {
  id?: string;
  name: string;
  disks: {
    type: 'data' | 'cache' | 'log';
    chassis: Option[];
    profile?: Profile | string;
  }[];
}

interface FormState {
  saving: boolean;
  saved: boolean;
}

interface ProfileOption {
  value: string;
  label: string;
}

interface FormInterface {
  formData: FormItems;
  state: FormState;
  chassis: ResponseMapper;
  profile: ProfileOption[];
  yupSchema: Yup.ObjectSchema<FormItems>;
}

interface ResponseMapper {
  dataDiskList: Option[];
  cacheDiskList: Option[];
  logDiskList: Option[];
}

export const PoolDelete = ({ opened, closed, pool }: PoolDeleteProps): React.ReactElement => {
  const { translate } = useTranslate();
  const [state, setState] = useState({ deleting: false, deleted: false });
  const handleSaveSubmit = async (): Promise<void> => {
    setState({ ...state, deleting: true, deleted: false });
    api
      .delete(`/storage/delete${pool?.id}`)
      .then((response) => {
        setState({ ...state, deleting: false, deleted: response.data.success === 200 });
        response.data.success === 200 &&
          notifications.show({
            title: translate('SUCCESS'),
            message: translate('API_POOL_DELETE_SUCCESS'),
            color: 'success.4',
          });
        closed();
      })
      .catch((error) => {
        setState({ ...state, deleting: false, deleted: false });
        notifications.show({
          title: translate('FAIL'),
          message: translate('API_POOL_DELETE_FAIL'),
          color: 'danger.3',
        });
        closed();
      });
  };

  return (
    <>
      <Modal
        centered
        radius="sm"
        size="550px"
        padding={'24px'}
        opened={opened}
        onClose={closed}
        title={translate('DELETE_POOL')}
        overlayProps={{
          color: 'rgba(22, 41, 73, 0.75)',
          opacity: 0.55,
          blur: 1,
        }}
      >
        <p className="secondary-500 body-14 mb-4" dangerouslySetInnerHTML={{ __html: translate('DELETE_POOL_MODAL_DESCRIPTION', { pool: pool?.name }) }} />
        <div className="modal-footer d-flex mt-4">
          <button className="btn btn-brand btn-ghost" onClick={(): void => closed()}>
            {translate('CANCEL')}
          </button>
          <button className="btn btn-danger" onClick={handleSaveSubmit}>
            {translate(state.deleting ? 'DELETING' : 'DELETE')}
          </button>
        </div>
      </Modal>
    </>
  );
};
