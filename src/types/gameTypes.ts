import { DoubleNumberDict } from './commonTypes';

export interface PlayerItem {
  id: string;
  username: string;
  definition: string;
  definitionId: number | undefined;
  points: number;
  connected: boolean;
}

export interface FinalePlayer {
  username: string;
  definition: string;
  word: string;
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
  topThree: FinaleDefinition[];
  reactions: DoubleNumberDict;
}

export interface ReactionsDictionary {
  [key: number]: { [key: number]: number };
}

export interface GuessItem {
  guess: number;
  player: string;
}

export interface GuessItemWithConnected {
  guess: number;
  player: string;
  connected: boolean;
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
  user_id: string;
  definition: string;
  word: string;
}

export interface TopPlayers {
  first: FinalePlayer;
  second: FinalePlayer;
  third: FinalePlayer;
}

export interface HandleSelectGuessParams {
  playerId: string;
  guessId: number;
  definitionSelection: DefinitionSelection;
}

export interface DefinitionResultItem {
  username: string;
  playerId: string;
  definition: string;
  definitionId: number;
  guesses: string[];
  points: number;
}

export interface PlayerDictionary {
  [Key: string]: string;
}

export interface DefinitionDictionary {
  [Key: number]: DefinitionResultItem;
}

export interface GetReactionsItem {
  count: number;
  definition_id: number;
  reaction_id: number;
}
