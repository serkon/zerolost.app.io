import { AxiosResponse } from 'axios';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from 'src/components/api/api';

import { AuthorizationHeader, HttpResponse, LoginResponse, User } from './dto';

export class Authenticator {
  static user: User | null = null;
  static tokens: LoginResponse | null = null;

  static isAuthenticated(): boolean {
    return !!Authenticator.user;
  }

  static async signIn({ username, password }: { username: string; password: string }, successCallback?: () => void, errorCallback?: () => void): Promise<void> {
    try {
      const login: AxiosResponse<HttpResponse<LoginResponse>> = await api.post('/login', {
        data: {
          email: username,
          password,
        },
      });

      Authenticator.tokens = login.data.data;
      window.localStorage.setItem(AuthorizationHeader.AccessToken, (login.data.data as LoginResponse).accessToken);
      window.localStorage.setItem(AuthorizationHeader.RefreshToken, (login.data.data as LoginResponse).refreshToken);
      window.sessionStorage.setItem('isAuthenticated', 'true');
      await this.getUser();
      successCallback && successCallback();
    } catch (e) {
      Authenticator.signOut();
      errorCallback && errorCallback();
    }
  }

  static async getUser(): Promise<User> {
    // Datayı boş gönderirsen header'da gönderdiğin access token ile girdiğin için mevcut kullanıcıyı getirir.
    // const user: AxiosResponse<HttpResponse<User>> = await api.post('/user', { data: 'sFlt01rLo65zIpwwHc7teuuQxgBlzhti' });
    const user: AxiosResponse<HttpResponse<User>> = await api.post('/user', { data: Authenticator.user?.id });

    Authenticator.user = user.data.data;
    window.localStorage.setItem('user', JSON.stringify(Authenticator.user));

    return user.data.data;
  }

  static async signOut(successCallback?: () => void, errorCallback?: () => void): Promise<void> {
    try {
      await api.post('/logout', { [AuthorizationHeader.RefreshToken]: window.localStorage.getItem(AuthorizationHeader.RefreshToken) || Authenticator.tokens?.refreshToken });
      Authenticator.user = null;
      Authenticator.tokens = null;
      window.localStorage.removeItem(AuthorizationHeader.AccessToken);
      window.localStorage.removeItem(AuthorizationHeader.RefreshToken);
      window.localStorage.removeItem('user');
      successCallback && successCallback();
    } catch (e) {
      errorCallback && errorCallback();
    }
  }

  static Navigate = ({ children }: React.PropsWithChildren): JSX.Element => {
    const location = useLocation();

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

    return <Navigate to="/login" state={{ from: location }} replace />;
  };
}
