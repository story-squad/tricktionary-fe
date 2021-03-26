import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useLocalStorage } from '../../../../../hooks';
import {
  availableReactionsState,
  definitionReactionsState,
  loadingState,
  lobbyState,
  playerGuessState,
} from '../../../../../state/gameState';
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
import { Host, Player, PlayerList, ProTip, Word } from '../../../../common';
import { RoundResults } from './RoundResults';

const Postgame = (props: PostgameProps): React.ReactElement => {
  const {
    handlePlayAgain,
    handleRevealResults,
    handleSetFinale,
    handleGetReactions,
  } = props;
  const [shouldGetReactions, setShouldGetReactions] = useState(true);
  const resetGuess = useResetRecoilState(playerGuessState);
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
    if (Object.keys(definitionReactions).length > 0 && shouldGetReactions) {
      handleGetReactions();
      setShouldGetReactions(false);
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
    <section className="postgame game-page">
      <h1>It’s Time for the Results!</h1>
      <Host>
        <ProTip
          message={`Reading the definition each player votes for makes the 
          game more fun! Example: Darwin voted for number 6: “silly or 
          high-spirited behavior; mischief.”`}
        />
        {lobbyData.phase === 'POSTGAME' && (
          // Show before reveal
          <p className="instructions">
            Players can’t see the results yet, so it’s up to you to read them
            with pizzaz! Say, “Remember, you get one point if you vote for the
            right definition and 1 point if yours ensnares someone else&apos;s
            vote. Let&apos;s reveal the results.
          </p>
        )}
        <Word word={lobbyData.word} />
        <RoundResults
          sortedDefinitions={sortedDefinitions}
          showReactions={lobbyData.phase === 'RESULTS'}
        />
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
              </div>
              <button
                className="orange display-block"
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
        <ProTip />
        {lobbyData.phase === 'POSTGAME' ? (
          // Before reveal
          <>
            <p className="instructions">
              Your host is now going to read the results! Did you guess the
              right one? How did your definition do? Did it reign supreme?
            </p>
            <Word word={lobbyData.word} />
          </>
        ) : (
          // After reveal
          <>
            <Word word={lobbyData.word} />
            <RoundResults
              sortedDefinitions={sortedDefinitions}
              showReactions={true}
            />
          </>
        )}
      </Player>
      <PlayerList hidePoints={lobbyData.phase === 'POSTGAME'} />
    </section>
  );
};

export default Postgame;

interface PostgameProps {
  handlePlayAgain: () => void;
  handleSetFinale: () => void;
  handleRevealResults: (guesses: GuessItem[]) => void;
  handleGetReactions: () => void;
}
