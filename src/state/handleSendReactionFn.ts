import { atom } from 'recoil';

export const handleSendReactionFn = atom<HandleSendReactionFn>({
  key: 'handleSendReactionFn',
  default: () => null,
});

type HandleSendReactionFn =
  | (() => null)
  | ((definitionId: number, reactionId: number) => void);
