/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_URL?: string;
  readonly REACT_APP_API_URL?: string;
  readonly REACT_APP_MAX_SECONDS?: string;
  readonly REACT_APP_TIMER_SYNC_INTERVAL?: string;
  readonly REACT_APP_LARGE_GAME_MINIMUM_PLAYERS?: string;
  readonly REACT_APP_MINIMUM_PLAYERS?: string;
  readonly REACT_APP_MAX_DEFINITION_LENGTH?: string;
  readonly REACT_APP_MAX_USERNAME_LENGTH?: string;
  readonly REACT_APP_MAX_NOTES_LENGTH?: string;
  readonly REACT_APP_MAX_CUSTOM_WORD_LENGTH?: string;
  readonly REACT_APP_PUBLIC_MEETING_URL?: string;
  readonly REACT_APP_PUBLIC_STREAM_URL?: string;
  readonly REACT_APP_REACTION_IDS?: string;
  readonly REACT_APP_MAX_LOADING_TIME?: string;
  readonly REACT_APP_JWT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
