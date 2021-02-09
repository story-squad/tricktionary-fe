export const randomUsername = (): string => {
  let random: number | string = Math.floor(Math.random() * 9999);
  if (random < 1000) {
    random = `0${random}`;
  }
  return `Player${random}`;
};
