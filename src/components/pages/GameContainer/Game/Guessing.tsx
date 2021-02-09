import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import shuffle from 'shuffle-array';
import { useLocalStorage } from '../../../../hooks';
import { lobbyState } from '../../../../state';
import {
  DefinitionItem,
  GuessItem,
  PlayerItem,
} from '../../../../types/gameTypes';
import { Host } from '../../../common/Host';
import { Modal } from '../../../common/Modal';
import { Player } from '../../../common/Player';

// Non-state functions

// Get a shuffled list of definitions + the correct one
const getDefinitions = (
  players: PlayerItem[],
  playerId: string,
  definition: string,
) => {
  let definitions = players
    .filter(
      (player: PlayerItem) =>
        player.id !== playerId && player.definition !== '',
    )
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
  const [guesses, setGuesses] = useLocalStorage('guesses', []);
  const [showModal, setShowModal] = useState(false);

  const allPlayersHaveGuessed = () => {
    let all = true;
    const playerGuesses = guesses.filter(
      (guess: GuessItem) => guess.player !== lobbyData.host,
    );
    for (let i = 0; i < playerGuesses.length; i++) {
      if (playerGuesses[i].guess === -1) {
        all = false;
        break;
      }
    }
    return all;
  };

  useEffect(() => {
    setGuesses(
      lobbyData.players.map((player) => {
        return { player: player.id, guess: -1 };
      }),
    );
  }, []);

  const handleSelectGuess = (
    e: React.MouseEvent,
    playerId: string,
    guessId: number,
  ) => {
    setGuesses(
      guesses.map((guess: GuessItem) => {
        if (guess.player === playerId) {
          return { ...guess, guess: guessId };
        } else {
          return guess;
        }
      }),
    );
  };

  const handleSubmit = () => {
    if (allPlayersHaveGuessed()) {
      handleSubmitGuesses(guesses);
    } else {
      setShowModal(true);
    }
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
                handleSelectGuess={handleSelectGuess}
                guesses={guesses}
              />
            ))}
          <button onClick={handleSubmit}>Submit Guesses</button>
        </div>
        <Modal
          message={`You haven't selected a guess for every player. Continue anyway?`}
          handleConfirm={() => handleSubmitGuesses(guesses)}
          handleCancel={() => setShowModal(false)}
          visible={showModal}
        />
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
  const { player, definitions, handleSelectGuess, guesses } = props;
  return (
    <div className="guess">
      <p>{player.username}</p>
      {definitions.map((definition, key) => (
        <button
          className={`${
            getPlayerGuess(guesses, player) === definition.id ? 'selected' : ''
          }`}
          onClick={(e) => handleSelectGuess(e, player.id, definition.id)}
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
  handleSubmitGuesses: (guesses: GuessItem[]) => void;
  playerId: string;
}

interface GuessProps {
  handleSelectGuess: (
    e: React.MouseEvent,
    playerId: string,
    guessId: number,
  ) => void;
  definitions: DefinitionItem[];
  player: PlayerItem;
  guesses: GuessItem[];
}
