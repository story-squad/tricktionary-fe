import { atom } from 'recoil';

export const timerState = atom<any>({
  key: 'timerState',
  default: {
    startTime: 0,
    currentTime: 0,
  },
});
