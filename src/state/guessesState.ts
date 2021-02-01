import { atom } from 'recoil';
import { GuessItem } from '../types/gameTypes';

export const guessesState = atom<GuessItem[]>({
  key: 'guessesState',
  default: [],
});
