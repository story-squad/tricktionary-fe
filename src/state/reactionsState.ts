import { atom } from 'recoil';
import { ReactionItem } from '../types/commonTypes';

export const reactionsState = atom<ReactionItem[]>({
  key: 'reactionsState',
  default: [],
});
