import { atom } from 'recoil';
import { GuessItem } from '../types/gameTypes';

export const handleSendReactionFn = atom<HandleSendReactionFn>({
  key: 'handleSendReactionFn',
  default: () => null,
});

type HandleSendReactionFn =
  | (() => null)
  | ((definitionId: number, reactionId: number) => void);

export const handleSetHostFn = atom<HandleSetHostFn>({
  key: 'handleSetHostFn',
  default: () => null,
});

type HandleSetHostFn =
  | (() => null)
  | ((hostId: string, lobbyCode: string, guesses: GuessItem[]) => void);
