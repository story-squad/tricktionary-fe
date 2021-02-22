import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import shuffle from 'shuffle-array';
import { useLocalStorage } from '../../../../hooks';
import { lobbyState, playerGuessState } from '../../../../state';
import {
  DefinitionItem,
  DefinitionSelection,
  GuessItem,
  PlayerItem,
} from '../../../../types/gameTypes';
import { Host } from '../../../common/Host';
import { Modal } from '../../../common/Modal';
import { Player } from '../../../common/Player';
import { PlayerList } from '../../../common/PlayerList';

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
  const { playerId, handleSubmitGuesses, handleSendGuess } = props;
  const lobbyData = useRecoilValue(lobbyState);
  const playerGuess = useRecoilValue(playerGuessState);
  // Call getDefinitions to set state. Invoking getDefinitions outside of state causes re-shuffling of the list on selection
  const [definitions] = useState(
    getDefinitions(lobbyData.players, playerId, lobbyData.definition),
  );
  const [guesses, setGuesses] = useLocalStorage(
    'guesses',
    lobbyData.players.map((player) => {
      return { player: player.id, guess: -1, connected: player.connected };
    }),
  );
  const [showModal, setShowModal] = useState(false);
  const [showGuesses, setShowGuesses] = useState(false);

  const allPlayersHaveGuessed = () => {
    let all = true;
    const playerGuesses = guesses.filter(
      (guess: GuessItem) => guess.player !== lobbyData.host,
    );
    for (let i = 0; i < playerGuesses.length; i++) {
      if (playerGuesses[i].guess === -1 && playerGuesses[i].connected) {
        all = false;
        break;
      }
    }
    return all;
  };

  // Recalculate guesses when players disconnect/reconnect while keeping guesses for all other players
  useEffect(() => {
    const guessDict: any = {};
    const newGuesses: any = [];
    guesses.forEach((guess: any) => {
      guessDict[guess.player] = {
        guess: guess.guess,
        connected: guess.connected,
      };
    });
    lobbyData.players.forEach((player) => {
      if (guessDict.hasOwnProperty(player.id)) {
        guessDict[player.id].connected = player.connected;
      } else {
        guessDict[player.id] = {
          player: player.id,
          guess: -1,
          connected: player.connected,
        };
      }
    });
    for (const playerId in guessDict) {
      if (guessDict[playerId].connected) {
        newGuesses.push({
          player: playerId,
          guess: guessDict[playerId].guess,
          connected: guessDict[playerId].connected,
        });
      }
    }
    setGuesses(newGuesses);
  }, [lobbyData]);

  const handleSelectGuess = (
    e: React.MouseEvent,
    playerId: string,
    guessId: number,
    definitionSelection: DefinitionSelection,
  ) => {
    handleSendGuess(playerId, definitionSelection);
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
      <h2>Time for your team to guess!</h2>
      <Host>
        <p>
          This is where the fun happens! Here are the definitions your players
          have submitted. To make sure all definitions are read, click on each
          definition to highlight it. That way you know whether you’ve read it
          or not. REMEMBER! Read each number before the definition.
        </p>
        <p className="word-display">{lobbyData.word}</p>
        {!showGuesses && (
          <div className="definitions">
            <h3>Definitions</h3>
            {definitions.map((definition, key) => (
              <div key={key} className="definition">
                <div className="definition-key">
                  <p>#{definition.definitionKey}</p>
                </div>
                <p>{definition.content}</p>
              </div>
            ))}
            <button
              className="submit-guesses"
              onClick={() => setShowGuesses(true)}
            >
              Start Voting
            </button>
          </div>
        )}
        {showGuesses && (
          <div className="guesses">
            <h3>Player Guesses</h3>
            <div className="voting-label">
              <h3>Name:</h3>
              <h3>Vote:</h3>
            </div>
            <hr />
            {lobbyData.players
              .filter(
                (player) => player.id !== lobbyData.host && player.connected,
              )
              .map((player, key) => (
                <Guess
                  key={key}
                  definitions={definitions as DefinitionItem[]}
                  player={player}
                  handleSelectGuess={handleSelectGuess}
                  guesses={guesses}
                />
              ))}
            <button className="submit-guesses" onClick={handleSubmit}>
              Submit Guesses
            </button>
          </div>
        )}
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
        <p className="word-display">{lobbyData.word}</p>
        <div className="player-guess">
          <h3>Your guess:</h3>
          {playerGuess.key > 0 ? (
            <>
              <p>#{playerGuess.key}</p>
              <p>{playerGuess.definition}</p>
            </>
          ) : (
            <p>?</p>
          )}
        </div>
        <p>Take notes:</p>
        <textarea maxLength={100} />
        <PlayerList />
      </Player>
    </div>
  );
};

const Guess = (props: GuessProps): React.ReactElement => {
  const { player, definitions, handleSelectGuess, guesses } = props;

  const chosenDefinition = definitions.filter(
    (definition) => definition.id === getPlayerGuess(guesses, player),
  )[0]?.content;

  return (
    <>
      <div className="guess">
        <p className="guess-name">{player.username}</p>
        {definitions.map((definition, key) => (
          <button
            className={`${
              getPlayerGuess(guesses, player) === definition.id
                ? 'selected'
                : ''
            }`}
            onClick={(e) =>
              handleSelectGuess(e, player.id, definition.id, {
                key: definition.definitionKey,
                definition: definition.content,
              })
            }
            key={key}
          >
            {definition.definitionKey}
          </button>
        ))}
      </div>
      <div className="show-guess">
        {chosenDefinition && (
          <div>
            <p>Chosen Definition: </p>
            <p className="guess-choice">{chosenDefinition}</p>
          </div>
        )}
      </div>
      <hr />
    </>
  );
};

export default Guessing;

interface GuessingProps {
  handleSubmitGuesses: (guesses: GuessItem[]) => void;
  handleSendGuess: (
    playerId: string,
    definitionSelection: DefinitionSelection,
  ) => void;
  playerId: string;
}

interface GuessProps {
  handleSelectGuess: (
    e: React.MouseEvent,
    playerId: string,
    guessId: number,
    definitionSelection: DefinitionSelection,
  ) => void;
  definitions: DefinitionItem[];
  player: PlayerItem;
  guesses: GuessItem[];
}
