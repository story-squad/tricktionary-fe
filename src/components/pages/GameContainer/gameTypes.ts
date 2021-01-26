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
  host: HostItem;
  lobbyCode: string;
  phase: string;
  players: PlayerItem[];
  roundId: number;
  word: string;
}

export interface GuessItem {
  guess: string;
  player: string;
}

export interface HostItem {
  id: string;
  username: string;
}

export interface DefinitionItem {
  content: string;
  id: number;
  definitionKey: number;
}
