import { atom } from 'recoil';

export const timerState = atom<any>({
  key: 'timerState',
  default: {
    startTime: -1,
    currentTime: -1,
  },
});
