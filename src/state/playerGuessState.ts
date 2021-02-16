import { atom } from 'recoil';
import { DefinitionSelection } from '../types/gameTypes';

export const playerGuessState = atom<DefinitionSelection>({
  key: 'playerGuess',
  default: {
    key: 0,
    definition: '',
  },
});
