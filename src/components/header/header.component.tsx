import './header.component.scss';

import { ChangeEvent, useState } from 'react';
import { useTranslate } from 'src/components/translate/translate.component';

export const Header = (): JSX.Element => {
  const {translateState, translateLanguage } = useTranslate();
  // eslint-disable-next-line
  const [_lang, setLang] = useState(translateState.language);
  const onLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    console.log('e', event.target.value);
    setLang(event.target.value);
    translateLanguage(event.target.value);
  };

  return (
    <header>
      <img src="/logo.svg" height="48px" alt="Logo" />
      <section className="navigations align-items-center">
        <button className="btn btn-primary btn-ghost btn-lg">Solutions</button>
        <button className="btn btn-primary btn-ghost btn-lg">Use Cases</button>
        <button className="btn btn-primary btn-ghost btn-lg">Features</button>
      </section>
      <section className="actions gap-2 d-flex align-items-center">
        <select value={translateState.language} onChange={onLanguageChange} className="language" aria-label="Select Language">
          <option value="tr">TR</option>
          <option value="en">EN</option>
        </select>
        <button className="btn btn-cta btn-lg">Lets Try Demo</button>
      </section>
    </header>
  );
};
