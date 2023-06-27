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
  profile: { value: string; label: string }[];
}

const init: AppState = {
  header: null,
  profile: [
    { value: '', label: 'PLACEHOLDER_PROFILE' },
    { value: 'mirror', label: 'MIRROR_STORAGE' },
    { value: 'mirror3', label: 'MIRROR3_STORAGE' },
    { value: 'raidz1', label: 'RAIDZ1_STORAGE' },
    { value: 'raidz2', label: 'RAIDZ2_STORAGE' },
    { value: 'raidz3_max', label: 'RAIDZ3_MAX_STORAGE' },
    { value: 'stripe', label: 'STRIPE_STORAGE' },
  ],
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
