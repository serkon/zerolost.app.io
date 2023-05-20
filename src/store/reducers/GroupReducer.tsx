import { AnyAction, Reducer } from 'redux';

export interface Group {
  id: string;
  name: string;
  games: number[];
}
export enum GROUP_ACTION {
  SET_GROUPS = 'SET_GROUPS',
  SET_SELECTED_GROUPS = 'SET_SELECTED_GROUPS',
}

export interface GroupState {
  list: Group[];
  selected: Group[];
}

const init: GroupState = {
  list: [
    { id: '1', name: 'domates', games: [12, 31, 123] },
    { id: '2', name: 'patates', games: [121, 312, 1423] },
  ],
  selected: [],
};

export const GroupReducer: Reducer = (state: GroupState = init, action) => {
  switch (action.type) {
  case GROUP_ACTION.SET_GROUPS: {
    return { ...state, list: action.payload };
  }
  case GROUP_ACTION.SET_SELECTED_GROUPS: {
    return { ...state, selected: action.payload };
  }
  default:
    return state;
  }
};

export const set_groups = (payload: Group[]): AnyAction => ({
  type: GROUP_ACTION.SET_GROUPS,
  payload,
});

export const set_selected_groups = (payload: Group[]): AnyAction => ({
  type: GROUP_ACTION.SET_SELECTED_GROUPS,
  payload,
});
