import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useLocalStorage } from '../../../../../hooks';
import {
  availableReactionsState,
  definitionReactionsState,
  loadingState,
  lobbyState,
  playerGuessState,
  showNewHostModalState,
} from '../../../../../state';
import {
  DefinitionResultItem,
  GuessItem,
  PlayerDictionary,
} from '../../../../../types/gameTypes';
import {
  createReactionsDictionary,
  getPlayerDictionary,
  getSortedDefinitions,
} from '../../../../../utils/helpers';
import { getSelectedReactions } from '../../../../../utils/helpers/apiHelpers';
import { initialToken } from '../../../../../utils/localStorageInitialValues';
import { Host } from '../../../../common/Host';
import { Modal } from '../../../../common/Modal';
import { Player } from '../../../../common/Player';
import { PlayerList } from '../../../../common/PlayerList';
import { ProTip } from '../../../../common/ProTip';
import { SetHost } from '../../../../common/SetHost';
import { DefinitionResult } from './DefinitionResult';

const Postgame = (props: PostgameProps): React.ReactElement => {
  const {
    handlePlayAgain,
    handleSetHost,
    handleRevealResults,
    handleSetFinale,
    handleGetReactions,
  } = props;
  const resetGuess = useResetRecoilState(playerGuessState);
  const [showNewHostModal, setShowNewHostModal] = useRecoilState(
    showNewHostModalState,
  );
  const [, setAvailableReactions] = useRecoilState(availableReactionsState);
  const [definitionReactions, setDefinitionReactions] = useRecoilState(
    definitionReactionsState,
  );
  const lobbyData = useRecoilValue(lobbyState);
  const loading = useRecoilValue(loadingState);
  const [playerDict] = useState<PlayerDictionary>(
    getPlayerDictionary(lobbyData.players),
  );
  const [guesses, , reloadGuesses] = useLocalStorage('guesses', initialToken);
  const [sortedDefinitions, setSortedDefinitions] = useState<
    DefinitionResultItem[]
  >(getSortedDefinitions(lobbyData, guesses as GuessItem[], playerDict));

  useEffect(() => {
    // Reset player's guess for next round
    resetGuess();
    getSelectedReactions()
      .then((resReactions) => {
        // Store reactions that can be used
        setAvailableReactions(resReactions);
        return resReactions;
      })
      .then((resReactions) => {
        // Create empty reactions dictionary to count reactions for each definition
        setDefinitionReactions(
          createReactionsDictionary(lobbyData.players, resReactions),
        );
      })
      .catch((err) => console.log(err));
  }, []);

  // After reactionsDictionary initialized, attempt to update definitionReactions if needed
  useEffect(() => {
    if (Object.keys(definitionReactions).length > 0) {
      handleGetReactions();
    }
  }, [definitionReactions]);

  // Create new sorted definitions array when player recieves guesses from host
  useEffect(() => {
    setSortedDefinitions(
      getSortedDefinitions(
        lobbyData,
        reloadGuesses() as GuessItem[],
        playerDict,
      ),
    );
  }, [lobbyData]);

  return (
    <div className="postgame game-page">
      <ProTip />
      <h2>It’s Time for the Results!</h2>
      <Host>
        {lobbyData.phase === 'POSTGAME' && (
          // Show before reveal
          <p className="instructions">
            Players can’t see the results yet, so it’s up to you to read them
            with pizzaz! Say, “Remember, you get one point if you vote for the
            right definition and 1 point if yours ensnares someone else&apos;s
            vote. Let&apos;s reveal the results.
          </p>
        )}
        <p className="word-display">{lobbyData.word}</p>
        <div className="round-results">
          {sortedDefinitions.map((definitionResult, key) => (
            <DefinitionResult
              key={key}
              definitionResult={definitionResult}
              showReactions={lobbyData.phase === 'RESULTS'}
            />
          ))}
        </div>
        <div className="endgame-container">
          {lobbyData.phase === 'POSTGAME' ? (
            // Before reveal
            <>
              <button onClick={() => handleRevealResults(guesses)}>
                Reveal Results
              </button>
            </>
          ) : (
            // After reveal
            <div className="after-reveal">
              <div className="after-container">
                <button
                  onClick={handleSetFinale}
                  disabled={loading === 'loading'}
                >
                  Go to Finale
                </button>
                <SetHost
                  players={lobbyData.players}
                  handleSetHost={handleSetHost}
                />
                <Modal
                  header={'Host Changed'}
                  message={'You are now the Host.'}
                  visible={showNewHostModal}
                  handleConfirm={() => setShowNewHostModal(false)}
                />
              </div>
              <button
                className="play-again"
                onClick={handlePlayAgain}
                disabled={loading === 'loading'}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </Host>
      <Player>
        {lobbyData.phase === 'POSTGAME' ? (
          // Before reveal
          <>
            <p className="instructions">
              Your host is now going to read the results! Did you guess the
              right one? How did your definition do? Did it reign supreme?
            </p>
            <p className="word-display">{lobbyData.word}</p>
          </>
        ) : (
          // After reveal
          <>
            <p className="word-display">{lobbyData.word}</p>
            <div className="round-results">
              {sortedDefinitions.map((definitionResult, key) => (
                <DefinitionResult
                  key={key}
                  definitionResult={definitionResult}
                  showReactions={true}
                />
              ))}
            </div>
          </>
        )}
      </Player>
      <PlayerList hidePoints={lobbyData.phase === 'POSTGAME'} />
    </div>
  );
};

export default Postgame;

interface PostgameProps {
  handlePlayAgain: () => void;
  handleSetHost: (hostId: string, guesses: GuessItem[]) => void;
  handleSetFinale: () => void;
  handleRevealResults: (guesses: GuessItem[]) => void;
  handleGetReactions: () => void;
}
