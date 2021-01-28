import { atom } from 'recoil';
import { GuessItem } from '../components/pages/GameContainer/gameTypes';

export const guessesState = atom<GuessItem[]>({
  key: 'guessesState',
  default: [],
});
