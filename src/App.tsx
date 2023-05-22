import './App.scss';

import React, { useEffect } from 'react';

import { Drawer } from './components/drawer/drawer.component';
import { useTranslate } from './components/translate/translate.component';

const App = (): React.JSX.Element => {
  const { translate } = useTranslate();

  useEffect(() => {
    document.title = translate('TITLE');
  },[translate]);

  return (
    <>
      <Drawer />
    </>
  );
};

export default App;
