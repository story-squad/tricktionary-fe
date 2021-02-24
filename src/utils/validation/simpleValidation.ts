// Quick, temporary string validation functions

export const definitionIsValid = (definition: string): boolean => {
  return definition.trim().length > 0 && definition.trim().length <= 250;
};
