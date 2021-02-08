// Quick, temporary string validation functions

export const usernameIsValid = (username: string): boolean => {
  if (username.trim().length > 1 && username.trim().length <= 12) {
    return true;
  } else {
    return false;
  }
};
