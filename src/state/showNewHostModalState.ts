import { atom } from 'recoil';

export const showNewHostModalState = atom<boolean>({
  key: 'revealResultsState',
  default: false,
});
