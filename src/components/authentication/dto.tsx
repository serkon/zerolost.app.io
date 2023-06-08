/*
export interface User {
  id: string;
  username: string;
  password: string;
  name?: string;
  email?: string;
  avatar?: string;
  provider?: number;
}
*/

export interface Role {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: number;
  name: string;
  description: string;
}

export interface User {
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  activated: boolean;
  roles: Role[];
}

export enum AuthorizationHeader {
  Authorization = 'Authorization',
  Bearer = 'Bearer',
  Basic = 'Basic',
  RefreshToken = 'refreshToken',
  AccessToken = 'authToken',
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
  // accessToken: string;
  // refreshToken: string;
  // refreshExpire: string | null;
  // time: number | undefined;
  expireTime: number;
  authToken: string;
}

/**
 * Http
 */
export interface HttpResponse<T> {
  // data: T;
  // paging?: { current: number; limit: number; total: number };
  // errorCode?: string;
  status: number;
  message: string;
  data: T;
  success: boolean;
  exception: boolean;
  currentPage: number;
  totalPages: number
}

export interface HttpRequest<T> {
  data: T;
  paging?: { current: number; limit: number };
  sort?: { field: string; order: string }[];
}
