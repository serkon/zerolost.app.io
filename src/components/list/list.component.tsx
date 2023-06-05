import './list.component.scss';

import { Menu,Text, TextInput } from '@mantine/core';
import { IconArrowsLeftRight, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash, IconX } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from 'src/components/translate/translate.component';

export const List = (): React.ReactElement => {
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState<string>('');
  const [filterOpen, setFilterOpen] = React.useState<boolean>(false);

  return (
    <div className="list-items">
      <section className="header px-3">
        <h2 className="h2 fw-extra-bold secondary-500">Storage</h2>
        <p className="m-0 secondary-400 fw-light">No data will be lost, never you will be code</p>
      </section>
      <section className="filter px-3">
        <Menu shadow="md" width={200} position="bottom-start">
          <Menu.Target>
            <div className="caption-10 secondary-400 ti-chevron-down ti-right flex-grow-1 justify-content-start">Ordering by Name</div>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
            <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
            <Menu.Item icon={<IconSearch size={14} />} rightSection={<Text size="xs" color="dimmed">⌘K</Text>}>Search</Menu.Item>
            <Menu.Divider />
            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
            <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <button className={`btn btn-brand btn-${!filterOpen ? 'ghost':''} btn-xs ti-filter`} onClick={():void => setFilterOpen(!filterOpen)} />
        <button className="btn btn-brand btn-ghost btn-xs ti-sort-descending" />
        <button className="btn btn-brand btn-ghost btn-xs ti-plus" />
      </section>
      <section className={`d-flex px-3 flex-column search ${!filterOpen && 'd-none'}`}>
        <TextInput
          size="sm"
          icon={<IconSearch size={16} />}
          placeholder={translate('SEARCH')}
          value={query}
          onChange={(e):void => setQuery(e.currentTarget.value)}
          rightSection={
            query ? (
              <IconX
                size={16}
                style={{
                  display: 'block',
                  opacity: 0.5,
                  cursor: 'pointer',
                }}
                onClick={():void => setQuery('')}
              />
            ) : null
          }
        />
      </section>
    </div>
  );};
