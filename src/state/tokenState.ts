import { atom } from 'recoil';
import { Token } from '../types/commonTypes';

export const tokenState = atom<Token>({
  key: 'token',
  default: {
    message: '',
    player: {
      created_at: '',
      id: '',
      jump_code: null,
      last_played: '',
      last_user_id: '',
      name: null,
      token: '',
    },
  },
});
