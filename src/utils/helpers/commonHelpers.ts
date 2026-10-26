export const getRandomFromArray = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Own-property check that works for any object (Object.hasOwn is ES2022)
export const hasOwn = (obj: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);
