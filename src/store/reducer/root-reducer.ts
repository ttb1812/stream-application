import {combineReducers} from '@reduxjs/toolkit';
import {
  UserJoinedReducerName,
  UserJoinedReducerReducer,
} from './user-joined-reducer';

const RootReducer = combineReducers({
  [UserJoinedReducerName]: UserJoinedReducerReducer,
});

export type RootReducerType = ReturnType<typeof RootReducer>;

export default RootReducer;
