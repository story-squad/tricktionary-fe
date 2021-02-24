export const definitionIsValid = (definition: string): any => {
  if (
    /[^A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\u0021-\u0029\u002a-\u003f\s]/.test(
      definition,
    )
  ) {
    return {
      valid: false,
      message:
        'Only the english alphabet, numbers, and punctuation allowed in the definition',
    };
  } else if (definition.length >= 250) {
    return {
      valid: false,
      message:
        'your definition is too long. It must be less than 250 characters',
    };
  } else {
    return { valid: true, message: '' };
  }
};
