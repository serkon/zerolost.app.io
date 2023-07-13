import { Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { Storage } from 'src/components/cards/storage/card/storage-card.component';
import { useTranslate } from 'src/components/translate/translate.component';

interface StorageDeleteProps {
  opened: boolean;
  closed: () => void;
  storage: Storage;
}

export const StorageDelete = ({ opened, closed, storage }: StorageDeleteProps): React.ReactElement => {
  const { translate } = useTranslate();
  const [state, setState] = useState({ deleting: false, deleted: false, name: '' });
  const handleSaveSubmit = async (): Promise<void> => {
    setState({ ...state, deleting: true, deleted: false });
    api
      .delete(`/storage/${storage?.id}`)
      .then((response) => {
        setState({ ...state, deleting: false, deleted: response.data.success === 200 });
        response.data.success === 200 &&
          notifications.show({
            title: translate('SUCCESS'),
            message: translate('API_STORAGE_DELETE_SUCCESS'),
            color: 'success.4',
          });
        closed();
      })
      .catch((error) => {
        setState({ ...state, deleting: false, deleted: false });
        notifications.show({
          title: translate('FAIL'),
          autoClose: false,
          message: error.response?.data.message,
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
        title={translate('DELETE_STORAGE')}
        overlayProps={{
          color: 'rgba(22, 41, 73, 0.75)',
          opacity: 0.55,
          blur: 1,
        }}
      >
        <p className="secondary-500 body-14 mb-4" dangerouslySetInnerHTML={{ __html: translate('DELETE_STORAGE_MODAL_DESCRIPTION', { storage: storage?.name }) }} />
        <input
          className="form-control form-control-sm"
          placeholder={translate('TYPE_STORAGE_NAME')}
          defaultValue=""
          onChange={(e): void => {
            setState((previousState) => ({ ...previousState, name: e.target.value }));
          }}
        />
        <div className="modal-footer d-flex mt-4">
          <button className="btn btn-brand btn-ghost" onClick={(): void => closed()}>
            {translate('CANCEL')}
          </button>
          <button className="btn btn-danger" onClick={handleSaveSubmit} disabled={state.deleting || state.name !== storage.name}>
            {translate(state.deleting ? 'DELETING' : 'DELETE')}
          </button>
        </div>
      </Modal>
    </>
  );
};
