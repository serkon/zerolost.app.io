import './drawer.component.scss';

import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslate } from 'src/components/translate/translate.component';
import { SiteRoutes } from 'src/Routing';

export const Drawer = (): React.JSX.Element => {
  const navigate = useNavigate();
  const {translate} = useTranslate();
  const [open, setOpen] = useState(true);
  const handleMenuClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <section className="drawer d-flex flex-grow-1">
      <aside className={'drawer-sidebar d-flex flex-column' + (open ? ' opened' : ' closed')}>
        <a className="drawer-logo" onClick={(): void => navigate('/test')} title={translate('HOME')} />
        <nav className=" animate-menu">
          {
            SiteRoutes.map((route, key) => (
              <button key={key} className={'btn btn-ghost btn-light btn-md ti-settings ti-right' + (open ? '' : ' menu-item animate-menu-item hide-menu-item')} title={route.title}>
                <span>{route.title}</span>
              </button>
            ))
          }
          <button className="btn btn-ghost btn-ghost btn-sm btn-warning ti-arrow-left ti-left" onClick={handleMenuClick}>sample</button>
          <button className="btn btn-ghost btn-ghost btn-sm btn-warning ti-arrow-left ti-right" onClick={handleMenuClick}>sample</button>
        </nav>
      </aside>
      <aside className="drawer-main flex-grow-1">main</aside>
      <aside className="drawer-info">right</aside>
    </section>
  );
};
