import { atom } from 'recoil';

export const isHostState = atom({
  key: 'isHost',
  default: false,
});
