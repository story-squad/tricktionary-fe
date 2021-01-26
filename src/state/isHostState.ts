import { atom } from 'recoil';

export const isHostState = atom<boolean>({
  key: 'isHost',
  default: false,
});
