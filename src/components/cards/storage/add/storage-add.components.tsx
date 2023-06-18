import { Button, Dialog, Group, Modal, PasswordInput, Select, Text, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { AppConfig } from 'src/app.config';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { useTranslate } from 'src/components/translate/translate.component';
import * as Yup from 'yup';

interface StorageAddProps {
  opened: boolean;
  closed: () => void;
  edit: 'edit' | 'add';
}

interface FormData {
  storageType: string;
  storageVersion: string;
  name: string;
  ipAddress: string;
  port: string;
  username: string;
  password: string;
}

interface FormState {
  testing: boolean;
  tested: boolean;
  saving: boolean;
  saved: boolean;
}

export const StorageAdd = ({ opened, closed, edit }: StorageAddProps): React.ReactElement => {
  const { translate } = useTranslate();
  const initialValues: FormData = {
    storageType: 'ss',
    storageVersion: 'v1',
    name: 'test-srknc',
    ipAddress: '127.0.0.1',
    port: '2002',
    username: 'test',
    password: 'test1234',
  };
  const initialFormStates: FormState = {
    testing: false,
    tested: false,
    saving: false,
    saved: false,
  };
  const yupSchema = Yup.object().shape({
    storageType: Yup.string().required(translate('VALIDATION_STORAGE_TYPE_REQUIRED')),
    storageVersion: Yup.string().required(translate('VALIDATION_STORAGE_VERSION_REQUIRED')),
    name: Yup.string().required(translate('VALIDATION_NAME_REQUIRED')),
    ipAddress: Yup.string()
      .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, translate('VALIDATION_IP_ADDRESS_FORMAT'))
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
    const { hasErrors, errors } = form.validate();

    setFormState({ ...initialFormStates, testing: true });
    if (!hasErrors) {
      api
        .post('/storage/test-connection', form.values)
        .then((response) => {
          setFormState({ ...initialFormStates, testing: false, tested: response.data.status === 200 });
          response.data.status === 200 &&
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
    }
    console.log('hasErrors', hasErrors, errors);
    // form.clearErrors();
  };
  const handleSaveSubmit = async (): Promise<void> => {
    const { hasErrors, errors } = form.validate();

    console.log('hasErrors', hasErrors, errors);
    // form.clearErrors();
  };
  const storageTypeOptions = [
    { value: 'zfs', label: translate('ZFS_STORAGE') },
    { value: 'ss', label: translate('SS_STORAGE') },
  ];

  useEffect(() => {
    setFormState({ ...initialFormStates });
    console.log(initialFormStates);
  }, [form.values]);

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
          <Select withAsterisk sx={{ flexGrow: 1 }} type="text" label={translate('TYPE')} placeholder={translate('PLACEHOLDER_TYPE')} name="storageType" data={storageTypeOptions} {...form.getInputProps('storageType')} />
          <TextInput withAsterisk sx={{ flexGrow: 1 }} type="text" label={translate('VERSION')} placeholder={translate('PLACEHOLDER_VERSION')} name="storageVersion" {...form.getInputProps('storageVersion')} />
          <TextInput withAsterisk sx={{ flexGrow: 1 }} type="text" label={translate('NAME')} placeholder={translate('PLACEHOLDER_NAME')} name="name" {...form.getInputProps('name')} />
          <TextInput withAsterisk sx={{ flexGrow: 1 }} type="text" label={translate('IP_ADDRESS')} placeholder={translate('PLACEHOLDER_IP_ADDRESS')} name="ipAddress" {...form.getInputProps('ipAddress')} />
          <TextInput withAsterisk sx={{ flexGrow: 1 }} type="number" label={translate('PORT_NUMBER')} placeholder={translate('PLACEHOLDER_PORT_NUMBER')} name="port" {...form.getInputProps('port')} />
          <TextInput withAsterisk sx={{ flexGrow: 1 }} type="text" label={translate('USERNAME')} placeholder={translate('PLACEHOLDER_USERNAME')} name="username" {...form.getInputProps('username')} />
          <PasswordInput
            withAsterisk
            sx={{ flexGrow: 1 }}
            label={translate('PASSWORD')}
            placeholder={translate('PLACEHOLDER_PASSWORD')}
            name="password"
            {...form.getInputProps('password')}
            visibilityToggleIcon={({ reveal, size }: any): React.ReactElement => (reveal ? <IconEye size={size} /> : <IconEyeOff size={size} />)}
          />
        </div>
        <div className="modal-footer d-flex justify-content-end mt-4">
          <button
            className="btn btn-brand btn-ghost"
            onClick={(): void => {
              closed();
              form.reset();
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
