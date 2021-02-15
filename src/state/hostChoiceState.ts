import { atom } from 'recoil';
import { HostChoice } from '../types/gameTypes';

export const hostChoiceState = atom<HostChoice>({
  key: 'hostchoice',
  default: {
    word_id_one: 0,
    word_id_two: 0,
    times_shuffled: -1,
  },
});
