import { atom } from 'recoil';
import { ReactionsDictionary } from '../types/gameTypes';

export const definitionReactionsState = atom<ReactionsDictionary>({
  key: 'definitionReactionsState',
  default: {},
});
