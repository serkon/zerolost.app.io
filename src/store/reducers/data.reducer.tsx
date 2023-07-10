import { Reducer } from 'react';
import { Storage } from 'src/components/cards/storage/card/storage-card.component';
import { Action } from 'src/store/store';

export enum DATA_ACTION {
  SET_STORAGES = 'SET_STORAGES',
}

export interface DataState {
  storage: {
    list: Storage[];
    selected: Storage | null;
    loading: boolean;
  };
}

const init: DataState = {
  storage: {
    list: [],
    selected: null,
    loading: false,
  },
};

export const DataReducer: Reducer<DataState, Action<DataState>> = (state: DataState = init, action: Action<any>): DataState => {
  switch (action.type) {
  case DATA_ACTION.SET_STORAGES: {
    return { ...state, storage: { ...state.storage, list: action.payload.list, loading: action.payload.loading, selected: action.payload.selected } };
  }
  default:
    return state;
  }
};

export const set_storages = (payload: DataState['storage']): Action<DataState['storage']> => ({
  type: DATA_ACTION.SET_STORAGES,
  payload,
});
