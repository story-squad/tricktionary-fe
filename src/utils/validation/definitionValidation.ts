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
  } else {
    return { valid: true, message: '' };
  }
};
