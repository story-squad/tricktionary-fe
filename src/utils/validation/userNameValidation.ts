export const usernameIsValid = (username: string): any => {
  if (/[^A-Za-z0-9]/.test(username)) {
    return {
      valid: false,
      message: 'Only alphanumeric characters are allowed in your username',
    };
  } else if (username.trim().length < 2) {
    return { valid: false, message: 'your username is too short' };
  } else if (username.trim().length >= 12) {
    return { valid: false, message: 'your username is too long' };
  } else {
    return { valid: true, message: '' };
  }
};
