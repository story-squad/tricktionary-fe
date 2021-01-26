import { atom } from 'recoil';

export const lobbyCodeState = atom<string>({
  key: 'lobbyCode',
  default: '',
});
