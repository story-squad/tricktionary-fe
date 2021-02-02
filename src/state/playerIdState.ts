import { atom } from 'recoil';

export const playerIdState = atom<string>({
  key: 'playerId',
  default: '',
});
