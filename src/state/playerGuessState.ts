import { atom } from 'recoil';

export const playerGuessState = atom<number>({
  key: 'playerGuess',
  default: 0,
});
