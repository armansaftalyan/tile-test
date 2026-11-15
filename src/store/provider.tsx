'use client';
import { useState, type ReactNode } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { makeStore, type AppDispatch, type RootState } from './index';
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
