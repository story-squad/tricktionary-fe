import * as errorCodeDict from './errorCode.json';

export const errorCodeChecker = (code: number): string => {
  if ((<any>errorCodeDict).default[code]) {
    return (<any>errorCodeDict).default[code];
  } else {
    return 'That code is not recognized';
  }
};
