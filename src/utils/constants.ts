export const REACT_APP_URL =
  process.env.REACT_APP_URL || 'http://localhost:3000';

export const REACT_APP_API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Max seconds for definition writing timer
export const MAX_SECONDS = Number(process.env.REACT_APP_MAX_SECONDS) || 120;

// How often the host sends a 'synchronize' event to set player timers
export const TIMER_SYNC_INTERVAL =
  Number(process.env.REACT_APP_TIMER_SYNC_INTERVAL) || 2;

// Number of players before the game changes to accommodate larger list of players and definitions
export const LARGE_GAME_MINIMUM_PLAYERS =
  Number(process.env.REACT_APP_LARGE_GAME_MINIMUM_PLAYERS) || 9;

// Number of players required to start a game. Set to 0 for testing
export const MINIMUM_PLAYERS =
  Number(process.env.REACT_APP_MINIMUM_PLAYERS) || 0;

export const MAX_DEFINITION_LENGTH =
  Number(process.env.REACT_APP_MAX_DEFINITION_LENGTH) || 350;

export const MAX_USERNAME_LENGTH =
  Number(process.env.REACT_APP_MAX_USERNAME_LENGTH) || 12;

// Number of characters allowed in note-taking on Guessing phase
export const MAX_NOTES_LENGTH =
  Number(process.env.REACT_APP_MAX_NOTES_LENGTH) || 100;

// Number of characters allowed in Host's custom word
export const MAX_CUSTOM_WORD_LENGTH =
  Number(process.env.REACT_APP_MAX_CUSTOM_WORD_LENGTH) || 45;

// For Tricktionary team to host public Zoom meeting
export const PUBLIC_MEETING_URL =
  process.env.REACT_APP_PUBLIC_MEETING_URL || '';

// For Tricktionary team to host public livestream
export const PUBLIC_STREAM_URL = process.env.REACT_APP_PUBLIC_STREAM_URL || '';

// Reaction IDs to be used in the emoji-smash feature, JSON-formatted list
export const REACTION_IDS = process.env.REACT_APP_REACTION_IDS || '[8, 13, 42]';

// Time until Loader closes in milliseconds
export const MAX_LOADING_TIME =
  Number(process.env.REACT_APP_MAX_LOADING_TIME) || 8000;

/* SECRETS, don't add default value */
export const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || '';
