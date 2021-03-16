import { atom } from 'recoil';

export const loadingState = atom<LoadingState>({
  key: 'loadingState',
  default: 'ok',
});

type LoadingState = 'ok' | 'loading' | 'failed';
