import {Store, configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger';
import {persistReducer, persistStore, PersistConfig} from 'redux-persist';
import RootReducer from './reducer/root-reducer';
import type {RootReducerType} from './reducer/root-reducer';
import RootSaga from './saga/root-saga';
const whitelist = [''];

const config: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  debug: true,
  whitelist,
  timeout: 10000,
};

const persistedReducer = persistReducer(config, RootReducer);
let middlewares: any = [];
const sagaMiddleware = createSagaMiddleware();

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

middlewares.push(sagaMiddleware);

export const store: Store<RootReducerType> = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...middlewares),
});

sagaMiddleware.run(RootSaga);

export const persistor = persistStore(store, {});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
