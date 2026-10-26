import errorCodes from './errorCode.json';

const errorCodeDict: Record<string, string> = errorCodes;

export const errorCodeChecker = (code: number): string => {
  if (errorCodeDict[code]) {
    return errorCodeDict[code];
  } else {
    return 'That code is not recognized';
  }
};
