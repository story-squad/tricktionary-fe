import { ValidationResult } from '../../types/commonTypes';

export const lobbyCodeIsValid = (code: string): ValidationResult => {
  if (/[^A-Za-z]/.test(code)) {
    return {
      valid: false,
      message: 'Only letters allowed in the lobby code',
    };
  } else {
    return { valid: true, message: '' };
  }
};
