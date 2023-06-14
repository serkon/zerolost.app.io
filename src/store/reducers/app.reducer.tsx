import { Reducer } from 'react';
import { Action } from 'src/store/store';

export enum APP_ACTION {
  SET_HEADER = 'SET_HEADER',
}

export interface AppHeader {
  title: string;
  label: string;
  value: string;
}

export interface AppState {
  header: AppHeader | null;
}

const init: AppState = {
  header: null,
};

export const AppReducer: Reducer<AppState, Action<AppState>> = (state: AppState = init, action: Action<any>): AppState => {
  switch (action.type) {
  case APP_ACTION.SET_HEADER: {
    return { ...state, header: action.payload };
  }
  default:
    return state;
  }
};

export const set_app_header = (payload: AppHeader): Action<AppHeader> => ({
  type: APP_ACTION.SET_HEADER,
  payload,
});
