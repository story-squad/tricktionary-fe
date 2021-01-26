import { atom } from 'recoil';
import { LobbyData } from '../components/pages/GameContainer/gameTypes';

export const lobbyState = atom<LobbyData>({
  key: 'lobbyState',
  default: {
    phase: 'LOBBY',
    players: [],
    definition: '',
    host: { id: '', username: '' },
    guesses: [],
    lobbyCode: '',
    roundId: 0,
    word: '',
  },
});
