export interface PlayerItem {
  id: string;
  username: string;
  definition: string;
  definitionId: number | undefined;
  points: number;
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