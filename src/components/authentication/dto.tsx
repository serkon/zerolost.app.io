export interface User {
  id: string;
  username: string;
  password: string;
  name?: string;
  email?: string;
  avatar?: string;
  provider?: number;
}

export enum AuthorizationHeader {
  Authorization = 'Authorization',
  Bearer = 'Bearer',
  Basic = 'Basic',
  RefreshToken = 'refreshToken',
  AccessToken = 'accessToken',
}

export interface RefreshTokenResponse {
  [AuthorizationHeader.AccessToken]: string;
  status: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshExpire: string | null;
  time: number | undefined;
}

/**
 * Http
 */
export interface HttpResponse<T> {
  data: T;
  paging?: { current: number; limit: number; total: number };
  errorCode?: string;
}

export interface HttpRequest<T> {
  data: T;
  paging?: { current: number; limit: number };
  sort?: { field: string; order: string }[];
}
