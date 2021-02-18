import { atom } from 'recoil';

export const revealResultsState = atom<boolean>({
  key: 'revealResultsState',
  default: false,
});
