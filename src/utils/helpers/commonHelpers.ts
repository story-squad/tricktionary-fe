export const getRandomFromArray = (array: Array<any>): any => {
  return array[Math.floor(Math.random() * array.length)];
};
