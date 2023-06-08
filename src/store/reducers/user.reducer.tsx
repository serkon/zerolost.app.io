import { Reducer } from 'redux';
import { Role, User } from 'src/components/authentication/dto';
import { Action } from 'src/store/store';

export interface Group {
  id: string;
  name: string;
  games: number[];
}

export enum USER_ACTION {
  SET_USER = 'SET_USER',
  SET_ROLE = 'SET_ROLE',
}

export interface UserState {
  user: User | null;
  roles: Role[] | null;
}

const init: UserState = {
  user: null,
  roles: null,
};

export const UserReducer: Reducer<UserState, Action<User>> = (state: UserState = init, action: Action<any>): UserState => {
  switch (action.type) {
  case USER_ACTION.SET_USER: {
    return { ...state, user: action.payload };
  }
  case USER_ACTION.SET_ROLE: {
    return { ...state, roles: action.payload };
  }
  default:
    return state;
  }
};

export const set_user = (payload: User): Action<User> => ({
  type: USER_ACTION.SET_USER,
  payload,
});

export const set_role = (payload: Role[]): Action<Role[]> => ({
  type: USER_ACTION.SET_ROLE,
  payload,
});
