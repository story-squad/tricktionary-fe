import { atom } from 'recoil';
import { TricktionarySettings } from '../types/gameTypes';

export const lobbySettingsState = atom<TricktionarySettings>({
  key: 'lobbySettings',
  default: {
    word: {
      id: 0,
      word: undefined,
      definition: undefined,
    },
    seconds: 60,
    filter: {
      style: undefined,
      list: undefined,
    },
    source: 'User',
  },
});
