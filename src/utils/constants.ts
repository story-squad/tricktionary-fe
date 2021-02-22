// Max seconds for definition writing timer
export const MAX_SECONDS = Number(process.env.MAX_SECONDS) || 120;
// How often the host sends a 'synchronize' event to set player timers
export const TIMER_SYNC_INTERVAL = Number(process.env.TIMER_SYNC_INTERVAL) || 2;
// Number of players before the game changes to accommodate larger list of players and definitions
export const LARGE_GAME_MINIMUM_PLAYERS =
  Number(process.env.LARGE_GAME_MINIMUM_PLAYERS) || 10;
