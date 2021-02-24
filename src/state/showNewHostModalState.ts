import { atom } from 'recoil';

export const showNewHostModalState = atom<boolean>({
  key: 'showNewHostModalState',
  default: false,
});
