import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Timeout: 5000,
    Expires: '0',
    withCredentials: false,
  },
});

api.defaults.withCredentials = false;

import { Authenticator } from './authenticator.component';
import { AuthorizationHeader, HttpResponse, RefreshTokenResponse } from './dto';

api.interceptors.request.use(
  (request: InternalAxiosRequestConfig<any>) => {
    const token = window.localStorage.getItem(AuthorizationHeader.AccessToken);

    // const headers: AxiosRequestHeaders = Object.assign({}, request.headers);
    if (token) {
      request.headers[AuthorizationHeader.Authorization] = `${AuthorizationHeader.Bearer} ${token}`;
    }

    return request;
  },
  (error) => {
    Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const res = error.response;

    if (res.status === 401 && !error.config.headers[AuthorizationHeader.RefreshToken]) {
      api.defaults.headers.common[AuthorizationHeader.RefreshToken] = true;
      try {
        const refreshToken = window.localStorage.getItem(AuthorizationHeader.RefreshToken);

        if (refreshToken) {
          const refreshResponse: AxiosResponse<HttpResponse<RefreshTokenResponse>> = await api.post('/refresh', {
            refreshToken,
          });

          window.localStorage.setItem(AuthorizationHeader.AccessToken, refreshResponse.data.data[AuthorizationHeader.AccessToken] as string);
          // api.defaults.headers.common['Authorization'] = 'Bearer ' + refreshResponse.data.accessToken;
          error.config.headers[AuthorizationHeader.Authorization] = `${AuthorizationHeader.Bearer} ${refreshResponse.data.data[AuthorizationHeader.AccessToken]}`;
          api.defaults.headers.common[AuthorizationHeader.RefreshToken] = false;
        } else {
          signOut();
          api.defaults.headers.common[AuthorizationHeader.RefreshToken] = false;

          // return Promise.reject(new Error('No refresh token'));
          return Promise.resolve(false);
        }
      } catch (_error: any) {
        signOut();
        if (_error.response && _error.response.data) {
          return Promise.reject(_error.response.data);
        }

        return Promise.reject(_error);
      }

      return api(error.config);
    }
    console.error('Looks like there was a problem. Status Code: ' + res.status);
    api.defaults.headers.common[AuthorizationHeader.RefreshToken] = false;

    return Promise.reject(error);
  },
);

const signOut = async (): Promise<void> => {
  await Authenticator.signOut((): string => (window.location.href = '/login'));
  api.defaults.headers.common[AuthorizationHeader.RefreshToken] = false;
};
