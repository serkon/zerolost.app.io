import { Reducer } from 'react';
import { Storage } from 'src/components/cards/storage/card/storage-card.component';
import { Action } from 'src/store/store';

export enum DATA_ACTION {
  SET_STORAGES = 'SET_STORAGES',
}

export interface DataState {
  storages: Storage[];
}

const init: DataState = {
  storages: [],
};

export const DataReducer: Reducer<DataState, Action<DataState>> = (state: DataState = init, action: Action<any>): DataState => {
  switch (action.type) {
  case DATA_ACTION.SET_STORAGES: {
    return { ...state, storages: action.payload };
  }
  default:
    return state;
  }
};

export const set_storages = (payload: Storage[]): Action<Storage[]> => ({
  type: DATA_ACTION.SET_STORAGES,
  payload,
});
