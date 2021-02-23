export const usernameIsValid = (username: string): any => {
  if (
    username.trim().length > 1 &&
    username.trim().length <= 12 &&
    !/[^A-Za-z0-9]/.test(username)
  ) {
    return true;
  } else {
    return false;
  }
};
