import './drawer.component.scss';
import 'simplebar-react/dist/simplebar.min.css';

import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { RouteItems } from 'src/components/drawer/Routing';
import { useTranslate } from 'src/components/translate/translate.component';

export const Drawer = ({ items }: { items: RouteItems[] }): React.JSX.Element => {
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const handleOpenerClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <>
      <section className="drawer">
        <aside className={'left' + (open ? ' opened' : ' closed')}>
          <button className="btn btn-outline ti-xs btn-warning ti-arrow-left ti-left opener" onClick={handleOpenerClick} />
          <div className="logo-container" onClick={(): void => navigate('/')} title={translate('HOME')}>
            <img src="/images/logo.svg" alt="logo" className="logo" />
            <img src="/images/logo-text.svg" className="logo-text" alt="logo" />
          </div>
          <div className="navigation">
            <SimpleBar style={{ maxHeight: '100%' }}>
              <Menu items={items} isOpen={open} isSubMenu={false} isHidden={false} />
            </SimpleBar>
          </div>
        </aside>
        <aside className="right d-flex flex-grow-1">
          <Outlet />
        </aside>
      </section>
    </>
  );
};

interface MenuProps {
  items: RouteItems[];
  isOpen: boolean;
  isSubMenu?: boolean;
  isHidden: boolean;
}

export const Menu = ({ items, isOpen, isSubMenu, isHidden = false }: MenuProps): React.JSX.Element => {
  const [hide, setHide] = useState<number[]>([]);
  const navigate = useNavigate();
  const handleClick = useCallback(
    (route: RouteItems, key: number) => {
      route.path && navigate(route.path);
      hide.includes(key) ? setHide(hide.filter((itemKey) => itemKey !== key)) : setHide([...hide, key]);
    },
    [hide],
  );
  const { translate } = useTranslate();

  return (
    <nav className={`menu ${isSubMenu ? 'mb-0 sub-level' : 'mb-2 top-level'} ${isOpen ? 'open' : 'close'} ${isHidden ? 'hide' : 'show'}`}>
      {items.map((route, key) => (
        <React.Fragment key={route.title}>
          <button className={`btn btn-ghost btn-light ${route.icon} ${isOpen ? 'opened-menu-item' : 'closed-menu-item'} ${isSubMenu ? 'btn-sm' : 'btn-md'}`} title={translate(route.title)} onClick={handleClick.bind(this, route, key)}>
            <span className={`${!isOpen && 'hide-span-item'}`}>{translate(route.title)}</span>
            {route.children && isOpen && <span className={` ${!hide.includes(key) ? 'ti-plus' : 'ti-minus'}  plus btn-sm`} />}
          </button>
          {route.children && <Menu items={route.children} isOpen={isOpen} isSubMenu={true} isHidden={!hide.includes(key)} />}
        </React.Fragment>
      ))}
    </nav>
  );
};
