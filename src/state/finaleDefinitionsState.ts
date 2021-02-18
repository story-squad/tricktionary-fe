import { atom } from 'recoil';
import { FinaleDefinition } from '../types/gameTypes';

export const finaleDefinitionsState = atom<FinaleDefinition[]>({
  key: 'finaleDefinitionsState',
  default: [],
});
