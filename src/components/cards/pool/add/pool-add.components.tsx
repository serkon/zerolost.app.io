import { Modal, Select, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { api } from 'src/components/authentication/authenticator.interceptor';
import { Pool, Profile } from 'src/components/cards/pool/card/pool-card.component';
import { CheckboxDropdown, Option } from 'src/components/multiselect/multiselect.component';
import { useTranslate } from 'src/components/translate/translate.component';
import useTextTransform from 'src/hooks/case';
import { AppState } from 'src/store/reducers/app.reducer';
import { RootState } from 'src/store/store';
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

export const PoolAdd = ({ opened, closed, edit, pool }: PoolAddProps): React.ReactElement => {
  const { translate } = useTranslate();
  const { upperCase } = useTextTransform();
  const appState = useSelector<RootState>((state): AppState => state.appStore) as AppState;
  const { storageId } = useParams();
  const initial: FormInterface = {
    state: {
      saving: false,
      saved: false,
    },
    formData: {
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
    chassis: {
      dataDiskList: [],
      cacheDiskList: [],
      logDiskList: [],
    },
    profile: appState.profile.map((option) => ({ value: option.value, label: translate(option.label) })),
    yupSchema: Yup.object().shape({
      id: Yup.string(),
      name: Yup.string().required(translate('VALIDATION_NAME_REQUIRED')),
      disks: Yup.array()
        .of(
          Yup.object().shape({
            type: Yup.string().oneOf(['data', 'log', 'cache']).required(translate('VALIDATION_DISK_TYPE_REQUIRED')),
            chassis: Yup.array()
              .test('chassis-test', translate('VALIDATION_CHASSIS_DISK_REQUIRED'), function(value) {
                const { type } = this.parent;
                const state = type === 'data' ? Yup.array().min(1, translate('VALIDATION_CHASSIS_DISK_REQUIRED')).required() : Yup.array().notRequired();

                return state.isValidSync(value);
              })
              // .min(1, 'en az chassis seçilmeli')
              .required('Chassis is required'),
            // profile: Yup.string().required('Profile is required'),
            profile: Yup.string().test('profile-test', translate('VALIDATION_PROFILE_REQUIRED'), function(value) {
              const { type, chassis } = this.parent;
              const state = type === 'data' ? Yup.string().required().notOneOf([''], 'Profile cannot be an empty string or null') : chassis.length > 0 ? Yup.string().required() : Yup.string().notRequired();

              return state.isValidSync(value);
            }),
          }),
        )
        .required('At least one disk is required'),
    }),
  };
  const form = useForm({ initialValues: initial.formData, validate: yupResolver(initial.yupSchema) });
  const [state, setState] = useState<FormInterface>(initial);
  const getChassis = (): void => {
    api.get('/chassis/by-storage/' + storageId).then((response) => {
      console.log(response.data.data);

      const arr: ResponseMapper = ['dataDiskList', 'cacheDiskList', 'logDiskList'].reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: response.data.chassis.flatMap((chassis: any, chassisIndex: number) =>
            chassis[cur].flatMap((item: any, itemIndex: number) =>
              item.disks.map((diskCount: number[], diskCountIndex: number) => ({
                label: item.diskSizeName,
                size: item.diskSizeName,
                group: chassis.name,
                id: `${chassisIndex}-${chassis.name}-Disk${itemIndex + 1}-${diskCountIndex + 1}`,
              })),
            ),
          ),
        }),
        { dataDiskList: [], cacheDiskList: [], logDiskList: [] },
      );

      console.log(arr);

      setState({
        ...state,
        chassis: arr,
      });
    });
  };
  const handleSaveSubmit = async (): Promise<void> => {
    const { hasErrors, errors } = form.validate();

    console.log('hasErrors', hasErrors, errors);

    if (hasErrors) return;
    setState({ ...state, ...{ state: { saving: true, saved: false } } });
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
    const value: FormItems = (pool && edit === 'edit' && { ...state.formData, ...{ id: pool.id, name: pool.name } }) || state.formData;

    form.reset();
    form.setValues(value);
    // form.reset();
  };

  useEffect(() => {
    getChassis();
  }, []);

  useEffect(() => {
    setState({ ...initial });
    console.log('adasd');
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
          {initial.formData.disks.map((disk, index) => (
            <React.Fragment key={index}>
              {/* <label className="secondary-600 caption-14 mt-4 mb-2 fw-semibold">{translate(upperCase(disk.type + '_TYPE'))}</label> */}
              <div className="d-flex flex-wrap gap-2 column-gap-4">
                {initial.chassis[`${disk.type}DiskList`].length > 0 && (
                  <>
                    <CheckboxDropdown options={initial.chassis[`${disk.type}DiskList`]} placeholder={translate('PLACEHOLDER_SELECT_DISK(S)')} label={translate(`${upperCase(disk.type)}_TYPE`)} {...form.getInputProps(`disks.${index}.chassis`)} />
                    <Select sx={{ flexGrow: 1 }} label={translate('PROFILE')} placeholder={translate('PLACEHOLDER_PROFILE')} name="profile" data={initial.profile} {...form.getInputProps(`disks.${index}.profile`)} />
                  </>
                )}
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
            {translate(state.state.saving ? 'SAVING' : 'SAVE')}
          </button>
        </div>
      </Modal>
    </>
  );
};
