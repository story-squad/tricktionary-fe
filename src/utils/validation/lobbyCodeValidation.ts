export const lobbyCodeIsValid = (code: string): any => {
  if (/[^A-Za-z]/.test(code)) {
    return {
      valid: false,
      message: 'Only letters allowed in the lobby code',
    };
  } else {
    return { valid: true, message: '' };
  }
};
