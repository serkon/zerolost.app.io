import { Reducer } from 'react';
import { AppConfig } from 'src/app.config';
import { Disk } from 'src/components/cards/disk/card/disk-card.component';
import { Pool } from 'src/components/cards/pool/card/pool-card.component';
import { Storage } from 'src/components/cards/storage/card/storage-card.component';
import { Action } from 'src/store/store';

export enum DATA_ACTION {
  SET_STORAGES = 'SET_STORAGES',
  SET_STORAGE_POOL = 'SET_STORAGE_POOL',
  SET_STORAGE_POOL_DISK = 'SET_STORAGE_POOL_DISK',
  SET_HOSTS = 'SET_HOSTS',
}

export interface DataState {
  storage: {
    list: Storage[];
    selected: Storage | null;
    loading: boolean;
    pool: {
      list: Pool[] | null;
      selected: Pool | null;
      page: number;
      size: number;
      totalPage: number;
      disk: {
        list: Disk[] | null;
        selected: Disk | null;
        page: number;
        size: number;
        totalPage: number;
      };
    };
  };
  host: {
    list: Storage[];
    selected: Storage | null;
    loading: boolean;
  };
}

export const DataStateInit: DataState = {
  storage: {
    list: [],
    selected: null,
    loading: false,
    pool: {
      list: [],
      selected: null,
      page: 0,
      size: AppConfig.paging.size,
      totalPage: 0,
      disk: {
        list: [],
        selected: null,
        page: 0,
        size: AppConfig.paging.size,
        totalPage: 0,
      },
    },
  },
  host: {
    list: [],
    selected: null,
    loading: false,
  },
};

export const DataReducer: Reducer<DataState, Action<DataState>> = (state: DataState = DataStateInit, action: Action<any>): DataState => {
  switch (action.type) {
  case DATA_ACTION.SET_STORAGES: {
    return {
      ...state,
      storage: {
        ...state.storage,
        list: action.payload.list || state.storage.list,
        loading: action.payload.loading === true,
        selected: action.payload.selected || state.storage.selected,
      },
    };
  }
  case DATA_ACTION.SET_STORAGE_POOL: {
    return {
      ...state,
      storage: {
        ...state.storage,
        pool: {
          ...state.storage.pool,
          list: action.payload.list || state.storage.pool.list,
          selected: action.payload.selected ? action.payload.selected : action.payload.selected === null ? null : state.storage.pool.selected,
          // eslint-disable-next-line max-len
          page: !action.payload.page && action.payload.page !== 0 ? state.storage.pool.page : action.payload.page || action.payload.page === 0 ? action.payload.page : state.storage.pool.page,
          size: action.payload.size || state.storage.pool.size,
          // eslint-disable-next-line max-len
          totalPage: !action.payload.totalPage && action.payload.totalPage !== 0 ? state.storage.pool.totalPage : action.payload.totalPage || action.payload.totalPage === 0 ? action.payload.totalPage : state.storage.pool.totalPage,
        },
      },
    };
  }
  case DATA_ACTION.SET_STORAGE_POOL_DISK: {
    return {
      ...state,
      storage: {
        ...state.storage,
        pool: {
          ...state.storage.pool,
          disk: {
            ...state.storage.pool.disk,
            list: action.payload.list || state.storage.pool.disk.list,
            selected: action.payload.selected || state.storage.pool.disk.selected,
            page: action.payload.paging?.page + state.storage.pool.disk.page || state.storage.pool.disk.page,
            size: action.payload.paging?.size || state.storage.pool.disk.size,
            totalPage: action.payload.paging?.totalPage || state.storage.pool.disk.totalPage,
          },
        },
      },
    };
  }
  default:
    return state;
  }
};

export const set_storages = (payload: Partial<DataState['storage']>): Action<Partial<DataState['storage']>> => ({
  type: DATA_ACTION.SET_STORAGES,
  payload,
});

export const set_storage_pool = (payload: Partial<DataState['storage']['pool']>): Action<Partial<DataState['storage']['pool']>> => ({
  type: DATA_ACTION.SET_STORAGE_POOL,
  payload,
});

export const set_storage_pool_disk = (payload: Partial<DataState['storage']['pool']['disk']>): Action<Partial<DataState['storage']['pool']['disk']>> => ({
  type: DATA_ACTION.SET_STORAGE_POOL_DISK,
  payload,
});

export const set_hosts = (payload: Partial<DataState['host']>): Action<Partial<DataState['host']>> => ({
  type: DATA_ACTION.SET_HOSTS,
  payload,
});
