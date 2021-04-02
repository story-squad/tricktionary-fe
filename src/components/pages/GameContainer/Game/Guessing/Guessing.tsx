import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocalStorage } from '../../../../../hooks';
import {
  loadingState,
  lobbyState,
  playerGuessState,
} from '../../../../../state/gameState';
import {
  DefinitionItem,
  DefinitionSelection,
  GuessItem,
} from '../../../../../types/gameTypes';
import { MAX_NOTES_LENGTH } from '../../../../../utils/constants';
import {
  allPlayersHaveGuessed,
  getDefinitions,
  recalculateGuessesWithConnected,
} from '../../../../../utils/helpers';
import { getGuessesWithConnected } from '../../../../../utils/localStorageInitialValues';
import {
  CharCounter,
  Host,
  Modal,
  Player,
  PlayerList,
  ProTip,
  View,
  Word,
} from '../../../../common';
import { PlayerStepTwo } from '../../../../common/Instructions';
import { Guess } from './Guess';

const Guessing = (props: GuessingProps): React.ReactElement => {
  const { playerId, handleSubmitGuesses, handleSendGuess } = props;
  const lobbyData = useRecoilValue(lobbyState);
  const playerGuess = useRecoilValue(playerGuessState);
  const loading = useRecoilValue(loadingState);
  // Call getDefinitions to set state. Invoking getDefinitions outside of state causes re-shuffling of the list on selection
  const [definitions] = useState(
    getDefinitions(lobbyData.players, playerId, lobbyData.definition),
  );
  // Array of player's guesses with connected status
  const [guesses, setGuesses] = useLocalStorage(
    'guesses',
    getGuessesWithConnected(lobbyData),
  );
  const [showModal, setShowModal] = useState(false);
  const [showGuesses, setShowGuesses] = useState(false);
  const [notes, setNotes] = useState('');

  // Recalculate guesses when players disconnect/reconnect
  useEffect(() => {
    setGuesses(recalculateGuessesWithConnected(lobbyData, guesses));
  }, [lobbyData]);

  const handleSelectGuess = (
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
    if (allPlayersHaveGuessed(lobbyData, guesses)) {
      handleSubmitGuesses(guesses);
    } else {
      setShowModal(true);
    }
  };

  return (
    <section className="guessing game-page">
      <Host>
        <ProTip
          message={
            'Read through the definitions twice. Give each one life by reading it like a story!'
          }
        />
        <View show={!showGuesses}>
          {/* Showing definitions */}
          <h1>Read Each Number and Its Definition</h1>
          <p className="instructions">
            The contestants have submitted their trick definitions. Now you need
            to summon your best gameshow host voice and read the number and
            definition from the list below. Once you finish, read through the
            same numbered list AGAIN.
          </p>
          <Word word={lobbyData.word} />
          <div className="definitions">
            <h3>Definitions</h3>
            {definitions.map((definition: DefinitionItem, key: number) => (
              <div key={key} className="definition">
                <div className="definition-key">
                  <p>#{definition.definitionKey}</p>
                </div>
                <p className="definition-guess">{definition.content}</p>
              </div>
            ))}
            <button
              className="submit-guesses"
              onClick={() => setShowGuesses(true)}
            >
              Start Voting
            </button>
          </div>
        </View>
        <View show={showGuesses}>
          {/* Showing votes */}
          <h1>It’s Time to Vote!</h1>
          <p className="instructions">
            Call on each contestant and ask for the number of their vote. Input
            their selection and confirm by reading the definition aloud.
            Example: &quot;Number 3, the squishy remains of rotten fruit.&quot;
          </p>
          <Word word={lobbyData.word} />
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
            <button
              className="submit-guesses"
              onClick={handleSubmit}
              disabled={loading === 'loading'}
            >
              Submit Guesses
            </button>
          </div>
        </View>
        <Modal
          header={'Continue?'}
          message={`You haven't selected a guess for every player. Continue anyway?`}
          handleConfirm={() => handleSubmitGuesses(guesses)}
          handleCancel={() => setShowModal(false)}
          visible={showModal}
        />
      </Host>
      <Player>
        <ProTip
          message={'Listen for the definition that strikes your fancy!'}
        />
        <h1>It’s Time to Vote</h1>
        <PlayerStepTwo />
        <Word word={lobbyData.word} />
        <div className="player-guess">
          <h3>Your guess:</h3>
          {playerGuess.key > 0 ? (
            <div className="definition">
              <div className="definition-key">
                <p>#{playerGuess.key}</p>
              </div>
              <p className="definition-guess">{playerGuess.definition}</p>
            </div>
          ) : (
            <p>No Guess yet</p>
          )}
        </div>
        <div className="notes">
          <h3>Listen to the definitions.</h3>
          <p>Take some notes!</p>
          <div className="char-counter-wrapper max-width-35-center">
            <textarea
              maxLength={MAX_NOTES_LENGTH}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <CharCounter string={notes} max={MAX_NOTES_LENGTH} />
          </div>
        </div>
      </Player>
      <PlayerList />
    </section>
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
