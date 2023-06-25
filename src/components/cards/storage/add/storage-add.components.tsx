import { Button, Dialog, Group, Modal, PasswordInput, Select, Text, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { AppConfig } from 'src/app.config';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { Storage } from 'src/components/cards/storage/card/storage-card.component';
import { useTranslate } from 'src/components/translate/translate.component';
import * as Yup from 'yup';

interface StorageAddProps {
  opened: boolean;
  closed: () => void;
  edit: 'edit' | 'add';
  storage: Storage | null;
}

interface FormData {
  storageType: string;
  storageVersion: string;
  name: string;
  ipAddress: string;
  port: string;
  username: string;
  password: string;
  id?: string;
}

interface FormState {
  testing: boolean;
  tested: boolean;
  saving: boolean;
  saved: boolean;
}
export const StorageAdd = ({ opened, closed, edit, storage }: StorageAddProps): React.ReactElement => {
  const { translate } = useTranslate();
  const initialValues: FormData = {
    storageType: '',
    storageVersion: '',
    name: '',
    ipAddress: '',
    port: '',
    username: '',
    password: '',
    // id: 'c5df0827-b3d8-4a4d-9837-5a5cf56a144d',
  };
  const initialValues2: FormData = {
    storageType: 'ZFS',
    storageVersion: '1.0.0',
    name: 'STORAGE-1',
    ipAddress: 'https://192.168.2.129',
    port: '215',
    username: 'root',
    password: '18319000Ek',
    // id: 'c5df0827-b3d8-4a4d-9837-5a5cf56a144d',
  };
  const initialFormStates: FormState = {
    testing: false,
    tested: false,
    saving: false,
    saved: false,
  };
  const yupSchema = Yup.object().shape({
    storageType: Yup.string().required(translate('VALIDATION_STORAGE_TYPE_REQUIRED')),
    storageVersion: Yup.number()
      .typeError(translate('VALIDATION_STORAGE_VERSION_INTEGER'))
      .lessThan(2, translate('VALIDATION_STORAGE_VERSION_LESS', { value: AppConfig.storage.form.version.lessThan }))
      .required(translate('VALIDATION_STORAGE_VERSION_REQUIRED')),
    name: Yup.string().required(translate('VALIDATION_NAME_REQUIRED')),
    ipAddress: Yup.string()
      // .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, translate('VALIDATION_IP_ADDRESS_FORMAT'))
      .required(translate('VALIDATION_IP_ADDRESS_REQUIRED')),
    port: Yup.number()
      .transform((value) => (Number.isNaN(value) ? null : value))
      .nullable()
      .min(AppConfig.storage.form.port.min, translate('VALIDATION_PORT_MIN', { value: AppConfig.storage.form.port.min }))
      .required(translate('VALIDATION_PORT_REQUIRED')),
    username: Yup.string().required(translate('VALIDATION_USERNAME_REQUIRED')),
    password: Yup.string()
      .max(AppConfig.storage.form.password.max, translate('VALIDATION_PASSWORD_MAX', { value: AppConfig.storage.form.password.max }))
      .min(AppConfig.storage.form.password.min, translate('VALIDATION_PASSWORD_MIN', { value: AppConfig.storage.form.password.min }))
      .required(translate('VALIDATION_PASSWORD_REQUIRED')),
  });
  const form = useForm({ initialValues, validate: yupResolver(yupSchema) });
  const [formState, setFormState] = useState<FormState>({
    testing: false,
    tested: false,
    saving: false,
    saved: false,
  });
  const handleTestSubmit = async (): Promise<void> => {
    const { hasErrors } = form.validate();

    setFormState({ ...initialFormStates, testing: true });
    if (!hasErrors) {
      api
        .post('/storage/test-connection', form.values)
        .then((response) => {
          setFormState({ ...initialFormStates, testing: false, tested: response.data.success });
          response.data.success &&
            notifications.show({
              title: translate('SUCCESS'),
              message: translate('TEST_CONNECTION_SUCCESS'),
              color: 'success.4',
            });
        })
        .catch((error) => {
          notifications.show({
            title: translate('FAIL'),
            message: translate('TEST_CONNECTION_FAIL'),
            color: 'danger.3',
          });
        });
    } else {
      setFormState({ ...initialFormStates, testing: false });
    }
    // form.clearErrors();
  };
  const handleSaveSubmit = async (): Promise<void> => {
    setFormState({ ...initialFormStates, saving: true });
    edit === 'edit'
      ? api.put('/storage', form.values)
      : api
        .post('/storage', form.values)
        .then((response) => {
          setFormState({ ...initialFormStates, testing: false, tested: response.data.success === 200 });
          if (response.data.success === 200) {
            notifications.show({
              title: translate('SUCCESS'),
              message: translate('TEST_CONNECTION_SUCCESS'),
              color: 'success.4',
            });
            closed();
          }
        })
        .catch((error) => {
          notifications.show({
            title: translate('FAIL'),
            message: translate('TEST_CONNECTION_FAIL'),
            color: 'danger.3',
          });
          closed();
        });
    setFormState({ ...initialFormStates, saving: false });
  };
  const handleCancel = (): void => {
    const value = (storage && edit === 'edit' && { ...storage, storageType: storage?.storageType, password: '' }) || initialValues;

    form.reset();
    form.setValues(value);
    // form.reset();
  };
  const storageTypeOptions = [
    { value: 'ZFS', label: translate('ZFS_STORAGE') },
    { value: 'SS', label: translate('SS_STORAGE') },
  ];

  useEffect(() => {
    setFormState({ ...initialFormStates });
  }, [form.values]);

  useEffect(() => {
    handleCancel();
  }, [storage, opened]);

  return (
    <>
      <Dialog opened={opened} withCloseButton onClose={closed} size="lg" radius="md">
        <Text size="sm" mb="xs" weight={500}>
          Subscribe to email newsletter
        </Text>

        <Group align="flex-end">
          <TextInput placeholder="hello@gluesticker.com" sx={{ flex: 1 }} />
          <Button onClick={closed}>Subscribe</Button>
        </Group>
      </Dialog>

      <Modal
        centered
        radius="sm"
        size="500px"
        padding={'24px'}
        opened={opened}
        onClose={closed}
        title={translate(edit === 'edit' ? 'EDIT_STORAGE' : 'ADD_STORAGE')}
        overlayProps={{
          color: 'rgba(22, 41, 73, 0.75)',
          opacity: 0.55,
          blur: 1,
        }}
      >
        <p className="secondary-500 body-14 mb-4">{translate('ADD_STORAGE_MODAL_DESCRIPTION')}</p>
        <div className="d-flex flex-wrap gap-2 column-gap-4">
          <Select withAsterisk sx={{ flexBasis: '30%', flexGrow: 1 }} type="text" label={translate('TYPE')} placeholder={translate('PLACEHOLDER_TYPE')} name="storageType" data={storageTypeOptions} {...form.getInputProps('storageType')} />
          <TextInput withAsterisk sx={{ flexBasis: '30%', flexGrow: 1 }} type="text" label={translate('VERSION')} placeholder={translate('PLACEHOLDER_VERSION')} name="storageVersion" {...form.getInputProps('storageVersion')} />
          <TextInput withAsterisk sx={{ flexBasis: '30%', flexGrow: 1 }} type="text" label={translate('NAME')} placeholder={translate('PLACEHOLDER_NAME')} name="name" {...form.getInputProps('name')} />
          <TextInput withAsterisk sx={{ flexBasis: '30%', flexGrow: 1 }} type="text" label={translate('IP_ADDRESS')} placeholder={translate('PLACEHOLDER_IP_ADDRESS')} name="ipAddress" {...form.getInputProps('ipAddress')} />
          <TextInput withAsterisk sx={{ flexBasis: '30%', flexGrow: 1 }} type="text" label={translate('USERNAME')} placeholder={translate('PLACEHOLDER_USERNAME')} name="username" {...form.getInputProps('username')} />
          <PasswordInput
            withAsterisk
            sx={{ flexBasis: '30%', flexGrow: 1 }}
            label={translate('PASSWORD')}
            placeholder={translate('PLACEHOLDER_PASSWORD')}
            name="password"
            {...form.getInputProps('password')}
            visibilityToggleIcon={({ reveal, size }: any): React.ReactElement => (reveal ? <IconEye size={size} /> : <IconEyeOff size={size} />)}
          />
          <TextInput withAsterisk sx={{ flexBasis: '30%', flexGrow: 1 }} type="number" label={translate('PORT_NUMBER')} placeholder={translate('PLACEHOLDER_PORT_NUMBER')} name="port" {...form.getInputProps('port')} />
        </div>
        <div className="modal-footer d-flex justify-content-end mt-4">
          <button
            className="btn btn-brand btn-ghost"
            onClick={(): void => {
              closed();
              handleCancel();
            }}
          >
            {translate('CANCEL')}
          </button>
          {!formState.tested && (
            <button className={`btn btn-brand`} onClick={handleTestSubmit} disabled={formState.testing}>
              {formState.testing ? translate('TESTING...') : translate('TEST')}
            </button>
          )}
          {formState.tested && (
            <button className="btn btn-brand" onClick={handleSaveSubmit}>
              {translate('SAVE')}
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};
