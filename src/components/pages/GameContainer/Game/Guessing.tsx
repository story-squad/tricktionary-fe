import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import shuffle from 'shuffle-array';
import { lobbyState } from '../../../../state';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';
import { DefinitionItem, GuessItem, PlayerItem } from '../gameTypes';

// Non-state functions

// Get a shuffled list of other players' definitions + the correct one
const getDefinitions = (
  players: PlayerItem[],
  playerId: string,
  definition: string,
) => {
  let definitions = players
    .filter((player: PlayerItem) => player.id !== playerId)
    .map((player: PlayerItem) => {
      return {
        content: player.definition,
        id: player.definitionId,
        definitionKey: 0,
      };
    });
  definitions.push({ id: 0, content: definition, definitionKey: 0 });
  definitions = shuffle(definitions);
  definitions = definitions.map((definition, idx) => {
    return { ...definition, definitionKey: idx + 1 };
  });
  return definitions;
};
const getPlayerGuess = (choices: GuessItem[], player: PlayerItem): number => {
  const found = choices.find((choice) => choice.player === player.id);
  return found?.guess as number;
};

// Components

const Guessing = (props: GuessingProps): React.ReactElement => {
  const { playerId, handleSubmitGuesses } = props;
  const lobbyData = useRecoilValue(lobbyState);
  // Call getDefinitions to set state. Invoking getDefinitions outside of state causes re-shuffling of the list on selection
  const [definitions] = useState(
    getDefinitions(lobbyData.players, playerId, lobbyData.definition),
  );
  const [choices, setChoices] = useState(
    lobbyData.players.map((player) => {
      return { player: player.id, guess: -1 };
    }),
  );

  const handleSelectChoice = (
    e: React.MouseEvent,
    playerId: string,
    guessId: number,
  ) => {
    setChoices(
      choices.map((choice) => {
        if (choice.player === playerId) {
          return { ...choice, guess: guessId };
        } else {
          return choice;
        }
      }),
    );
  };

  return (
    <div className="guessing game-page">
      <h2>Guessing</h2>
      <p className="word-display">Word: {lobbyData.word}</p>
      <Host>
        <div className="definitions">
          <h3>Definitions</h3>
          {definitions.map((definition, key) => (
            <div key={key} className="definition">
              <div className="definition-key">
                <p>{definition.definitionKey}</p>
              </div>
              <p className="definition-content">{definition.content}</p>
            </div>
          ))}
        </div>
        <div className="guesses">
          <h3>Player Guesses</h3>
          {lobbyData.players
            .filter((player) => player.id !== lobbyData.host)
            .map((player, key) => (
              <Guess
                key={key}
                definitions={definitions as DefinitionItem[]}
                player={player}
                handleSelectChoice={handleSelectChoice}
                choices={choices}
              />
            ))}
          <button onClick={(e) => handleSubmitGuesses(e, choices)}>
            Submit Guesses
          </button>
        </div>
      </Host>
      <Player>
        <p>
          The host will list off the definitions and their numbers. When the
          host calls on you, choose a number.
        </p>
      </Player>
    </div>
  );
};

const Guess = (props: GuessProps): React.ReactElement => {
  const { player, definitions, handleSelectChoice, choices } = props;
  return (
    <div className="guess">
      <p>{player.username}</p>
      {definitions.map((definition, key) => (
        <button
          className={`${
            getPlayerGuess(choices, player) === definition.id ? 'selected' : ''
          }`}
          onClick={(e) => handleSelectChoice(e, player.id, definition.id)}
          key={key}
        >
          {definition.definitionKey}
        </button>
      ))}
    </div>
  );
};

export default Guessing;

interface GuessingProps {
  handleSubmitGuesses: (e: React.MouseEvent, guesses: GuessItem[]) => void;
  playerId: string;
}

interface GuessProps {
  handleSelectChoice: (
    e: React.MouseEvent,
    playerId: string,
    guessId: number,
  ) => void;
  definitions: DefinitionItem[];
  player: PlayerItem;
  choices: GuessItem[];
}
