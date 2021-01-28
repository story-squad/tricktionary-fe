import { atom } from 'recoil';

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

export interface TricktionarySettings {
  word: {
    id: number;
    word: string | undefined;
    definition: string | undefined;
  };
  seconds: number | undefined;
  filter: {
    style: string | undefined;
    list: string[] | undefined;
  };
  source: string | undefined;
}
