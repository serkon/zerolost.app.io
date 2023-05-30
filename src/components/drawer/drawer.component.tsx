import './drawer.component.scss';

import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { RouteItems } from 'src/components/drawer/Routing';
import { useTranslate } from 'src/components/translate/translate.component';

export const Drawer = ({items}: {items: RouteItems[]}): React.JSX.Element => {
  const navigate = useNavigate();
  const {translate} = useTranslate();
  const [open, setOpen] = useState(true);
  const handleMenuClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <section className="drawer d-flex flex-grow-1">
      <aside className={'drawer-sidebar d-flex flex-column' + (open ? ' opened' : ' closed')}>
        <a className="drawer-logo mx-4" onClick={(): void => navigate('/test')} title={translate('HOME')}>
          <img src="/images/logo.svg" alt="logo" className="logo" /><img src="/images/logo-text.svg" className="logo-text" alt="logo" />
        </a>
        <Menu items={items} isOpen={open} isSubMenu={false} isHidden={false} />
        <button className="btn btn-outline ti-xs btn-warning ti-arrow-left ti-left opener" onClick={handleMenuClick} />
      </aside>
      <aside className="drawer-main flex-grow-1">main</aside>
      <aside className="drawer-info">right</aside>
    </section>
  );
};

export const Menu = ({items, isOpen, isSubMenu, isHidden = false}: {items: RouteItems[], isOpen: boolean, isSubMenu?: boolean, isHidden: boolean}): React.JSX.Element => {
  const [hide, setHide] = useState<number[]>([]);
  const handleClick = useCallback((route: RouteItems, key: number) => {
    hide.includes(key) ? setHide(hide.filter((itemKey) => itemKey !== key)) :setHide([...hide, key]);
  }, [hide]);
  const {translate} = useTranslate();

  return (
    <nav className={`d-flex flex-column animate-menu side-navigation ${isSubMenu ? 'mb-0' : 'mb-2 px-3 top-level-nav-menu'} ${(isOpen ? 'open' : 'close')} ${(isHidden && 'hide')}`}>
      {
        items.map((route, key) => (
          <React.Fragment key={key}>
            <button
              className={`btn btn-ghost btn-light ${route.icon} ${(isOpen ? 'opened-menu-item' : 'closed-menu-item')} ${isSubMenu ? 'submenu btn-sm' : 'btn-md'}`}
              title={translate(route.title)}
              onClick={handleClick.bind(this, route, key)}
            >
              <span className={`${(!isOpen && 'hide-span-item')}`}>{translate(route.title)}</span>
              {route.children && isOpen && <span className={`ti-plus plus btn-sm`} />}
            </button>
            {route.children && <Menu items={route.children} isOpen={isOpen} isSubMenu={true} isHidden={hide.includes(key)} />}
          </React.Fragment>
        ))
      }
    </nav>
  );};
