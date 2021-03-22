import { atom } from 'recoil';
import { GuessItem } from '../types/gameTypes';

export const handleSetHostFn = atom<HandleSetHostFn>({
  key: 'handleSetHostFn',
  default: () => null,
});

type HandleSetHostFn =
  | (() => null)
  | ((hostId: string, lobbyCode: string, guesses: GuessItem[]) => void);
