import { atom } from 'recoil';
import { LobbyData } from '../types/gameTypes';

export const lobbyState = atom<LobbyData>({
  key: 'lobbyState',
  default: {
    phase: 'LOBBY',
    players: [],
    definition: '',
    host: '',
    guesses: [],
    lobbyCode: '',
    roundId: 0,
    word: '',
    roundSettings: {
      seconds: 60,
      source: 'User',
      filter: {
        style: '',
        list: [],
      },
    },
    topThree: [],
    reactions: {},
  },
});
