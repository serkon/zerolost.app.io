import { Modal, Select, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { Pool, Profile } from 'src/components/cards/pool/card/pool-card.component';
import { CheckboxDropdown, Option } from 'src/components/multiselect/multiselect.component';
import { useTranslate } from 'src/components/translate/translate.component';
import useTextTransform from 'src/hooks/case';
import * as Yup from 'yup';

interface PoolAddProps {
  opened: boolean;
  closed: () => void;
  edit: 'edit' | 'add';
  pool: Pool | null;
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
  initial: FormItems;
  state: FormState;
  chassis: Option[];
  profile: ProfileOption[];
  yupSchema: Yup.ObjectSchema<FormItems>;
}

export const PoolAdd = ({ opened, closed, edit, pool }: PoolAddProps): React.ReactElement => {
  const { translate } = useTranslate();
  const { upperCase } = useTextTransform();
  const FormInitial = Form();
  const form = useForm({ initialValues: FormInitial.initial, validate: yupResolver(FormInitial.yupSchema) });
  const [formState, setFormState] = useState<FormState>(FormInitial.state);
  const handleSaveSubmit = async (): Promise<void> => {
    const { hasErrors, errors } = form.validate();

    console.log('hasErrors', hasErrors, errors);

    if (hasErrors) return;
    setFormState({ ...FormInitial.state, saving: true, saved: false });
    // edit === 'edit' ? api.put('/storage', form.values) : api.post('/storage', form.values);
    // .then((response) => {
    //   setFormState({ ...FormInitial.state, saving: false, saved: response.data.success === 200 });
    //   response.data.success === 200 &&
    //       notifications.show({
    //         title: translate('SUCCESS'),
    //         message: translate('TEST_CONNECTION_SUCCESS'),
    //         color: 'success.4',
    //       });
    // })
    // .catch((error) => {
    //   setFormState({ ...FormInitial.state, saving: false, saved: false });
    //   notifications.show({
    //     title: translate('FAIL'),
    //     message: translate('TEST_CONNECTION_FAIL'),
    //     color: 'danger.3',
    //   });
    // });
  };
  const handleCancel = (): void => {
    const value: FormItems = (pool && edit === 'edit' && { ...FormInitial.initial, ...{ id: pool.id, name: pool.name } }) || FormInitial.initial;

    form.reset();
    form.setValues(value);
    // form.reset();
  };

  useEffect(() => {
    setFormState({ ...FormInitial.state });
  }, [form.values]);

  useEffect(() => {
    handleCancel();
  }, [pool, opened]);

  return (
    <>
      <Modal
        centered
        radius="sm"
        size="550px"
        padding={'24px'}
        opened={opened}
        onClose={closed}
        title={translate(edit === 'edit' ? 'EDIT_POOL' : 'ADD_POOL')}
        overlayProps={{
          color: 'rgba(22, 41, 73, 0.75)',
          opacity: 0.55,
          blur: 1,
        }}
      >
        <p className="secondary-500 body-14 mb-4">{translate('ADD_POOL_MODAL_DESCRIPTION')}</p>
        {JSON.stringify(form.values)}
        <TextInput sx={{ flexBasis: '30%', flexGrow: 1 }} label={translate('NAME')} placeholder={translate('PLACEHOLDER_NAME')} name="name" {...form.getInputProps('name')} className="mb-4" />
        <div className="d-flex flex-grow-1 gap-3 flex-column">
          {FormInitial.initial.disks.map((disk, index) => (
            <React.Fragment key={index}>
              {/* <label className="secondary-600 caption-14 mt-4 mb-2 fw-semibold">{translate(upperCase(disk.type + '_TYPE'))}</label> */}
              <div className="d-flex flex-wrap gap-2 column-gap-4">
                <CheckboxDropdown options={Form().chassis} placeholder={translate('PLACEHOLDER_SELECT_DISK(S)')} label={translate(`${upperCase(disk.type)}_TYPE`)} {...form.getInputProps(`disks.${index}.chassis`)} />
                <Select sx={{ flexGrow: 1 }} label={translate('PROFILE')} placeholder={translate('PLACEHOLDER_PROFILE')} name="profile" data={Form().profile} {...form.getInputProps(`disks.${index}.profile`)} />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="modal-footer d-flex mt-4">
          <button
            className="btn btn-brand btn-ghost"
            onClick={(): void => {
              // closed();
              handleCancel();
            }}
          >
            {translate('CANCEL')}
          </button>
          <button className="btn btn-brand" onClick={handleSaveSubmit}>
            {translate(formState.saving ? 'SAVING' : 'SAVE')}
          </button>
        </div>
      </Modal>
    </>
  );
};

const Form = (): FormInterface => {
  const { translate } = useTranslate();

  return {
    state: {
      saving: false,
      saved: false,
    },
    initial: {
      id: '',
      name: '',
      disks: [
        {
          type: 'data',
          chassis: [],
          profile: '',
        },
        {
          type: 'cache',
          chassis: [],
          profile: '',
        },
        {
          type: 'log',
          chassis: [],
          profile: '',
        },
      ],
    },
    chassis: [
      { value: '1', label: '1 GB', size: '1', group: 'Chassis 01' },
      { value: '2', label: '1 GB', size: '1', group: 'Chassis 01' },
      { value: '3', label: '1 GB', size: '1', group: 'Chassis 01' },
      { value: '4', label: '2 GB', size: '2', group: 'Chassis 08' },
      { value: '5', label: '3 GB', size: '3', group: 'Chassis 08' },
      { value: '6', label: '5 GB', size: '5', group: 'Chassis 08' },
      { value: '7', label: '5 GB', size: '5', group: 'Chassis 08' },
      { value: '8', label: '1 GB', size: '1', group: 'Chassis 011' },
      { value: '9', label: '3 GB', size: '3', group: 'Chassis 011' },
      { value: '10', label: '3 GB', size: '3', group: 'Chassis 011' },
    ],
    profile: [
      { value: '', label: translate('PLACEHOLDER_PROFILE') },
      { value: 'mirror', label: translate('MIRROR_STORAGE') },
      { value: 'mirror3', label: translate('MIRROR3_STORAGE') },
      { value: 'raidz1', label: translate('RAIDZ1_STORAGE') },
      { value: 'raidz2', label: translate('RAIDZ2_STORAGE') },
      { value: 'raidz3_max', label: translate('RAIDZ3_MAX_STORAGE') },
      { value: 'stripe', label: translate('STRIPE_STORAGE') },
    ],
    yupSchema: Yup.object().shape({
      id: Yup.string(),
      name: Yup.string().required('Name is required'),
      disks: Yup.array()
        .of(
          Yup.object().shape({
            type: Yup.string().oneOf(['data', 'log', 'cache']).required('Disk type is required'),
            chassis: Yup.array()

              // .of(
              //   Yup.object().shape({
              //     value: Yup.string().required('Value is required'),
              //     label: Yup.string().required('Label is required'),
              //     size: Yup.string().required('Size is required'),
              //     group: Yup.string().required('Group is required'),
              //   }),
              // )
              .test('chassis-test', 'chassis seçilmeli', function(value) {
                const { type } = this.parent;
                const state = type === 'data' ? Yup.array().min(1, 'chassis seçilmeli').required() : Yup.array().notRequired();

                return state.isValidSync(value);
              })
              // .min(1, 'en az chassis seçilmeli')
              .required('Chassis is required'),
            // profile: Yup.string().required('Profile is required'),
            profile: Yup.string().test('profile-test', 'Profile is required for data disks', function(value) {
              const { type, chassis } = this.parent;
              const state = type === 'data' ? Yup.string().required().notOneOf([''], 'Profile cannot be an empty string or null') : chassis.length > 0 ? Yup.string().required() : Yup.string().notRequired();

              return state.isValidSync(value);
            }),
          }),
        )
        .required('At least one disk is required'),
    }),
  };
};
