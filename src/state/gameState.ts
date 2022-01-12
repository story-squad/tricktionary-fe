import { atom } from 'recoil';
import { ReactionItem } from '../types/commonTypes';
import {
  DefinitionSelection,
  GuessItem,
  HostChoice,
  LoadingState,
  LobbyData,
  ReactionsDictionary,
  Timer,
  TricktionarySettings,
} from '../types/gameTypes';

export const allowUrlJoinState = atom<boolean>({
  key: 'allowUrlJoinState',
  default: false,
});

export const availableReactionsState = atom<ReactionItem[]>({
  key: 'availableReactionsState',
  default: [],
});

export const definitionReactionsState = atom<ReactionsDictionary>({
  key: 'definitionReactionsState',
  default: {},
});

export const guessesState = atom<GuessItem[]>({
  key: 'guessesState',
  default: [],
});

export const hostChoiceState = atom<HostChoice>({
  key: 'hostchoice',
  default: {
    word_id_one: 0,
    word_id_two: 0,
    times_shuffled: -1,
  },
});

export const loadingState = atom<LoadingState>({
  key: 'loadingState',
  default: 'ok',
});

export const lobbyCodeState = atom<string>({
  key: 'lobbyCode',
  default: '',
});

export const lobbySettingsState = atom<TricktionarySettings>({
  key: 'lobbySettings',
  default: {
    word: {
      id: 0,
      word: undefined,
      definition: undefined,
    },
    seconds: 60,
    filter: {
      style: undefined,
      list: undefined,
    },
    source: 'User',
  },
});

export const lobbyState = atom<LobbyData>({
  key: 'lobbyState',
  default: {
    phase: 'LOBBY',
    players: [],
    rounds: [],
    definition: '',
    host: '',
    guesses: [],
    lobbyCode: '',
    roundId: 0,
    word: '',
    roundSettings: {
      seconds: 60,
      source: 'User',
      filter: {
        style: '',
        list: [],
      },
    },
    topThree: [],
    reactions: {},
  },
});

export const playerGuessState = atom<DefinitionSelection>({
  key: 'playerGuess',
  default: {
    key: 0,
    definition: '',
  },
});

export const playerIdState = atom<string>({
  key: 'playerId',
  default: '',
});

export const revealResultsState = atom<boolean>({
  key: 'revealResultsState',
  default: false,
});

export const timerState = atom<Timer>({
  key: 'timerState',
  default: {
    startTime: -1,
    currentTime: -1,
  },
});

export const canSendReactionState = atom<boolean>({
  key: 'canSendReactionState',
  default: true,
});
