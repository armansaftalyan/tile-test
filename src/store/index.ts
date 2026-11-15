import { configureStore } from '@reduxjs/toolkit';
import cart from './cart';
import design from './design';

// A store per mounted app, rather than a server-side module singleton.
export const makeStore = () => configureStore({ reducer: { cart, design } });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
