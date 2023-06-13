import './header.component.scss';

import { Avatar, Divider, Menu, Text } from '@mantine/core';
import { IconArrowsLeftRight, IconBell, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons-react';
import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppConfig } from 'src/app.config';
import { Authenticator } from 'src/components/authentication/authenticator.component';
import { useTranslate } from 'src/components/translate/translate.component';
import { UserState } from 'src/store/reducers/user.reducer';
import { RootState } from 'src/store/store';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Header = ({ className, ...rest }: HeaderProps): React.JSX.Element => {
  const { translateState, translateLanguage, translate } = useTranslate();
  const userState = useSelector<RootState>((state): UserState => state.userStore) as UserState;
  // const userState = { user: { firstName: 'adasd', lastName: 'asdasd', email: 'adasd' } };

  // eslint-disable-next-line
  const [_lang, setLang] = useState(translateState.language);
  const onLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    console.log('e', event.target.value);
    setLang(event.target.value);
    translateLanguage(event.target.value);
  };

  return (
    <header className={`d-flex top-header px-4 ${className}`} {...rest}>
      <section className="header-title">
        <Text
          truncate
          className="h1 fw-extra-bold secondary-600"
          sx={(): any => ({
            '@media (max-width: 90em)': {
              maxWidth: '298px',
            },
          })}
        >
          ZFS Storage # 7
        </Text>
        <aside className="caption-10 secondary-300 d-flex gap-2">
          <span className="fw-bold">Installed</span>
          <span className="fw-bold">•</span>
          <span>{'2018-11-27 19:12:38'}</span>
        </aside>
      </section>
      <section className="actions d-flex align-items-center justify-content-end flex-grow-1">
        <select value={translateState.language} onChange={onLanguageChange} className="language secondary-300 caption-12" aria-label="Select Language">
          <option value="tr">TR</option>
          <option value="en">EN</option>
        </select>
        <button className="btn btn-secondary btn-sm btn-ghost me-2">
          <IconBell size={20} />
        </button>
        <Divider orientation="vertical" color="secondary.0" />
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <div className="d-flex align-items-center gap-2 user">
              <div className="d-flex flex-column align-items-end gap-1 ms-3">
                <div className="caption-14 fw-semibold secondary-600">
                  {userState.user?.firstName} {userState.user?.lastName}
                </div>
                <div className="caption-12 secondary-400">{userState.user?.email}</div>
              </div>
              <Avatar color="brand.5" radius="xl">
                {userState.user?.firstName[0]}
                {userState.user?.lastName[0]}
              </Avatar>
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>User Detail</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
            <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
            <Menu.Item
              icon={<IconSearch size={14} />}
              rightSection={
                <Text size="xs" color="dimmed">
                  ⌘K
                </Text>
              }
            >
              {translate('SEARCH')}
            </Menu.Item>
            <Menu.Item icon={<IconTrash size={14} />} onClick={(): Promise<void> => Authenticator.signOut(() => window.location.reload())}>
              {translate('LOGOUT')}
            </Menu.Item>
            {AppConfig.profile.dangerZone && (
              <>
                <Menu.Divider />
                <Menu.Label>Danger zone</Menu.Label>
                {AppConfig.profile.transfere && <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>}
                {AppConfig.profile.delete && (
                  <Menu.Item color="red" icon={<IconTrash size={14} />}>
                    {translate('DELETE_MY_ACCOUNT')}
                  </Menu.Item>
                )}
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      </section>
    </header>
  );
};
