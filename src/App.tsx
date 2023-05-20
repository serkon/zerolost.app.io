import './App.scss';

import React, { useEffect } from 'react';

import { Header } from './components/header/header.component';
import { Slider } from './components/slider/slider.component';
import { useTranslate } from './components/translate/translate.component';

const App = (): React.JSX.Element => {
  const { translate } = useTranslate();
  const setColumn = (columns: number):void => {
    console.log('setColumn', (columns));
  };

  useEffect(() => {
    document.title = translate('TITLE');
  },[translate]);

  return (
    <>
      <Header />
      <section className="container">
        <Slider initial={5} start={3} count={12} onClick={setColumn} reset={3} />
      </section>
    </>
  );
};

export default App;
