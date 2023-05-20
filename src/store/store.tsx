import { applyMiddleware, CombinedState, combineReducers, legacy_createStore as createStore } from 'redux';

import { GroupReducer } from './reducers/GroupReducer';

const combine = combineReducers({
  groups: GroupReducer,
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
