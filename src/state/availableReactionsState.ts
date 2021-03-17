import { atom } from 'recoil';
import { ReactionItem } from '../types/commonTypes';

export const availableReactionsState = atom<ReactionItem[]>({
  key: 'availableReactionsState',
  default: [],
});
