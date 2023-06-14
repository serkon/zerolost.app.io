import { applyMiddleware, CombinedState, combineReducers, legacy_createStore as createStore } from 'redux';

import { AppReducer } from './reducers/app.reducer';
import { GroupReducer } from './reducers/GroupReducer';
import { UserReducer } from './reducers/user.reducer';

export interface Action<T> {
  type: string;
  payload: T;
}

const combine = combineReducers({
  groups: GroupReducer,
  userStore: UserReducer,
  appStore: AppReducer,
});
const loggerMiddleware =
  (storeAPI: any) =>
    (next: any) =>
      (action: any): any => {
        // console.log('dispatching', action);
        // OKU: https://redux.js.org/tutorials/fundamentals/part-6-async-logic
        storeAPI;
        const result = next(action);

        // console.log('next state', storeAPI.getState());
        return result;
      };

export type RootState = ReturnType<typeof combine>;
export const store: CombinedState<any> = createStore(combine, applyMiddleware(loggerMiddleware));
export type DispatchType = typeof store.dispatch;
export type StateType = ReturnType<typeof store.getState>;
// store.subscribe(() => console.log(store.getState().user));
