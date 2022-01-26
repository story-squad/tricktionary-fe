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
          <h1 className="page-title">Read Each Number and Its Definition</h1>

          <p className="instructions">
            The contestants have submitted their trick definitions. Now you need
            to summon your best gameshow host voice and read the number and
            definition from the list below. Once you finish, read through the
            same numbered list AGAIN.
          </p>

          <section>
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
          </section>
        </View>

        <View show={showGuesses}>
          {/* Showing votes */}
          <h1 className="page-title">It’s Time to Vote!</h1>

          <p className="instructions">
            Call on each contestant and ask for the number of their vote. Input
            their selection and confirm by reading the definition aloud.
            Example: &quot;Number 3, the squishy remains of rotten fruit.&quot;
          </p>

          <section>
            <Word word={lobbyData.word} />

            <div className="guesses">
              <h3>Player Guesses</h3>
              <div className="voting-heading row">
                <div className="guess-name">Name:</div>
                <div className="guess-vote">Vote:</div>
              </div>
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
                    lobbyData={lobbyData}
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
          </section>
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
          message={
            'Compose your best trick defintion to get other players to vote for it. Click “submit” before the time runs out!'
          }
        />

        <h1 className="page-title">It’s Time to Vote</h1>

        <p className="instructions">
          <PlayerStepTwo />
        </p>

        <section>
          <Word word={lobbyData.word} />

          <div className="player-guess">
            <h3 className="guess-label">Your guess:</h3>

            <div className="guess">
              {playerGuess.key > 0 ? (
                <p>
                  #{playerGuess.key} - {playerGuess.definition}
                </p>
              ) : (
                <p>No Guess yet</p>
              )}
            </div>
          </div>

          {playerGuess.key === 0 && (
            <div className="notes">
              <div className="char-counter-wrapper">
                <div className="form-input">
                  <label htmlFor="notes">
                    Take some notes or write your choice so you don’t forget.
                  </label>
                  <textarea
                    maxLength={MAX_NOTES_LENGTH}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    id="notes"
                  />
                </div>

                <CharCounter string={notes} max={MAX_NOTES_LENGTH} />
              </div>
            </div>
          )}
        </section>
      </Player>

      <section className="white-bg bottom-radius">
        <PlayerList />
      </section>
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
