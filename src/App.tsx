import './App.scss';
import 'src/components/authentication/authenticator.interceptor';

import React, { useEffect } from 'react';

import { Drawer } from './components/drawer/drawer.component';
import { RouteList } from './components/drawer/Routing';
import { useTranslate } from './components/translate/translate.component';

const App = (): React.JSX.Element => {
  const { translate } = useTranslate();

  useEffect(() => {
    document.title = translate('TITLE');
  },[translate]);

  return (
    <>
      <Drawer items={RouteList} />
    </>
  );
};

export default App;
