import './login.screen.scss';

import {TextInput} from '@mantine/core';
import type { Location } from 'history';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Authenticator } from 'src/components/authentication/authenticator.component';
import { useTranslate } from 'src/components/translate/translate.component';

import Logo from './images/login-logo.svg';

export const LoginScreen = (): JSX.Element => {
  const { translate } = useTranslate();
  const navigate = useNavigate();
  const location: Location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  const [state, setState] = React.useState<{ error: string } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    waiting(true);
    Authenticator.signIn(
      { username, password },
      () => {
        navigate(from, { replace: true });
        waiting(false);
      },
      () => {
        setState({ error: translate('Invalid_email_or_password') });
        waiting(false);
      },
    );
  };
  const waiting = (status: boolean): void => {
    setLoading(status);
  };

  return (
    <div className="login-screen d-flex flex-grow-1">
      <div className="left d-flex flex-column">
        <img src={Logo} alt="logo" className="logo" />
      </div>
      <div className="right d-flex flex-column align-items-center">
        {state?.error && <p className="error">{state?.error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <section className="d-flex gap-4 flex-column">
            <h1>{translate('WELCOME')}</h1>
            <p className="lead secondary-500 m-0">{translate('LOGIN_DESCRIPTION')}</p>
          </section>
          <section className="d-flex gap-3 flex-column">
            <TextInput type="text" label={translate('USERNAME')} placeholder={translate('USERNAME')} defaultValue={'serkon'} name="username" />
            <TextInput type="password" label={translate('PASSWORD')} placeholder={translate('PASSWORD')} defaultValue={'123456'} name="password" />
          </section>
          <section className="d-flex flex-column mt-4 gap-32">
            <div className="d-flex justify-content-between">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="remmeber-me" />
                <label className="form-check-label caption-16 secondary-500" htmlFor="remmeber-me">{translate('REMEMBER_ME')}</label>
              </div>
              <div>
                <Link className="brand-500 caption-16" to={'/forgot-password'}>{translate('FORGOT_PASSWORD')}</Link>
              </div>
            </div>
            <button type="submit" className="btn btn-brand btn-lg" disabled={loading}>
              {!loading ? translate('LOGIN') : <img src="/images/loading.svg" className="loading-icon" />}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};
