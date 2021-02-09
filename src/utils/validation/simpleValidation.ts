// Quick, temporary string validation functions

export const usernameIsValid = (username: string): boolean => {
  if (username.trim().length > 1 && username.trim().length <= 12) {
    return true;
  } else {
    return false;
  }
};

export const definitionIsValid = (definition: string): boolean => {
  return definition.trim().length > 0 && definition.trim().length <= 250;
};
