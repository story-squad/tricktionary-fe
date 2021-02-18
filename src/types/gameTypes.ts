export interface PlayerItem {
  id: string;
  username: string;
  definition: string;
  definitionId: number | undefined;
  points: number;
  connected: boolean;
}

export interface LobbyData {
  definition: string;
  guesses: GuessItem[];
  host: string;
  lobbyCode: string;
  phase: string;
  players: PlayerItem[];
  roundId: number;
  word: string;
  roundSettings: {
    seconds: number;
    source: string;
    filter: {
      style: string;
      list: unknown[];
    };
  };
}

export interface GuessItem {
  guess: number;
  player: string;
}

export interface DefinitionItem {
  content: string;
  id: number;
  definitionKey: number;
}

export interface DefinitionSelection {
  key: number;
  definition: string;
}

export interface WordItem {
  id: number;
  word: string;
  definition: string;
}

export interface TricktionarySettings {
  word: {
    id: number;
    word: string | undefined;
    definition: string | undefined;
  };
  seconds: number | undefined;
  filter: {
    style: string | undefined;
    list: string[] | undefined;
  };
  source: string | undefined;
}

export interface HostChoice {
  word_id_one: number;
  word_id_two: number;
  times_shuffled: number;
}

export interface FinaleDefinition {
  playerId: string;
  definition: string;
}
