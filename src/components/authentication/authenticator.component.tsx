import { AxiosResponse } from 'axios';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { set_role, set_user } from 'src/store/reducers/user.reducer';
import { store } from 'src/store/store';

import { api } from './authenticator.interceptor';
import { AuthorizationHeader, HttpResponse, LoginResponse, User } from './dto';

export class Authenticator {
  static user: User | null = null;
  static tokens: LoginResponse | null = null;

  static isAuthenticated(): boolean {
    const user = window.localStorage.getItem('user');

    if (window.sessionStorage.getItem('isAuthenticated') === 'true' && !!user) {
      store.dispatch(set_user(JSON.parse(user)));
    }

    return window.sessionStorage.getItem('isAuthenticated') === 'true';
  }

  static async signIn({ username, password }: { username: string; password: string }, successCallback?: () => void, errorCallback?: () => void): Promise<void> {
    try {
      const login: AxiosResponse<HttpResponse<LoginResponse>> = await api.post('/auth/login', {
        // data: {
        email: username,
        password,
        // },
      });

      Authenticator.tokens = login.data.data;
      window.localStorage.setItem(AuthorizationHeader.AccessToken, login.data.data.authToken);
      // window.localStorage.setItem(AuthorizationHeader.RefreshToken, (login.data as LoginResponse).refreshToken);
      window.sessionStorage.setItem('isAuthenticated', 'true');
      await this.getUser();
      successCallback?.();
    } catch (e) {
      await Authenticator.signOut();
      errorCallback?.();
    }
  }

  static async getUser(): Promise<User> {
    // Datayı boş gönderirsen header'da gönderdiğin access token ile girdiğin için mevcut kullanıcıyı getirir.
    // const user: AxiosResponse<HttpResponse<User>> = await api.post('/user', { data: 'sFlt01rLo65zIpwwHc7teuuQxgBlzhti' });
    const user: AxiosResponse<HttpResponse<User>> = await api.get('/auth/me');

    // TODO set notification
    try {
      store.dispatch(set_user(user.data.data));
      store.dispatch(set_role(user.data.data.roles));
    } catch (e) {
      console.log('Cant set user store: ', e);
    }

    Authenticator.user = user.data.data;
    window.localStorage.setItem('user', JSON.stringify(Authenticator.user));

    return user.data.data;
  }

  static async signOut(successCallback?: () => void, errorCallback?: () => void): Promise<void> {
    const removeUserCredentials = (): void => {
      window.localStorage.removeItem(AuthorizationHeader.AccessToken);
      window.localStorage.removeItem(AuthorizationHeader.RefreshToken);
      window.localStorage.removeItem('user');
      window.sessionStorage.setItem('isAuthenticated', 'false');
    };

    try {
      // await api.post('/logout', { [AuthorizationHeader.RefreshToken]: window.localStorage.getItem(AuthorizationHeader.RefreshToken) || Authenticator.tokens?.refreshToken });
      await api.get('/auth/logout');
      Authenticator.user = null;
      Authenticator.tokens = null;
      removeUserCredentials();
      successCallback?.();
    } catch (e) {
      removeUserCredentials();
      errorCallback?.();
    }
  }

  static Navigate = ({ children }: React.PropsWithChildren): JSX.Element => {
    if (Authenticator.isAuthenticated() && window.sessionStorage.getItem('isAuthenticated') === 'true') {
      return <>{children}</>;
      /*
        <>
          <p>
            Welcome {Authenticator.user && Authenticator.user.username}!
            <button
              onClick={() => {
                Authenticator.signOut({ id: '2sdasd-33sad-23123-daddd', callback: () => navigate('/') });
              }}
            >
              Sign out
            </button>
          </p>
          {children}
        </>
        */
    }
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    const location = useLocation();

    return <Navigate to="/login" state={{ from: location }} replace />;
  };
}
