import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useLocalStorage } from '../../../../hooks';
import {
  lobbyState,
  playerGuessState,
  revealResultsState,
  showNewHostModalState,
} from '../../../../state';
import { GuessItem, LobbyData, PlayerItem } from '../../../../types/gameTypes';
import { Host } from '../../../common/Host';
import { Modal } from '../../../common/Modal';
import { Player } from '../../../common/Player';
import { SetHost } from '../../../common/SetHost';
import { PlayerList } from '../Game';

// Create a list of definitions, attach players who guessed for each, calculate point gains (UI only), add real definiton to the end
const getSortedDefinitions = (
  lobbyData: LobbyData,
  guesses: GuessItem[],
  playerDict: PlayerDictionary,
): DefinitionResultItem[] => {
  // Create a definition dictionary to easily map all player guesses to each definition
  const definitions: DefinitionDictionary = {};
  lobbyData.players.forEach((player) => {
    if (player.id !== lobbyData.host) {
      definitions[player.definitionId as number] = {
        username: player.username,
        playerId: player.id,
        definition: player.definition,
        definitionId: player.definitionId as number,
        guesses: [],
        points: 0,
      };
    }
  });
  // Add real definition
  definitions[0] = {
    username: `Real Definition for ${lobbyData.word}`,
    playerId: '0',
    definition: lobbyData.definition,
    definitionId: 0,
    guesses: [],
    points: 0,
  };
  // Add player guesses to corresponding definitions and increment points earned
  guesses.forEach((guess) => {
    try {
      definitions[guess.guess].guesses.push(playerDict[guess.player]);
      definitions[guess.guess].points += 1;
    } catch {
      return;
    }
  });
  // Get an array from the result that can be sorted and mapped in JSX
  let definitionArray = Object.values(definitions);
  // Grab the real definition to place at the end after the array is sorted
  const realDefinition = definitionArray.filter(
    (definition) => definition.definitionId === 0,
  );
  // Remove the real definition and sort by point values
  definitionArray = definitionArray
    .filter((definition) => definition.definitionId !== 0)
    .sort((a, b) => (a.points > b.points ? 1 : -1));
  // Add the real definition at the end
  definitionArray.push(...realDefinition);
  return definitionArray;
};

// Generate a dictionary of playerId: username to make getSortedDefinitions more efficient
const getPlayerDictionary = (players: PlayerItem[]): PlayerDictionary => {
  const dict: PlayerDictionary = {};
  players.forEach((player) => {
    dict[player.id] = player.username;
  });
  return dict;
};

const Postgame = (props: PostgameProps): React.ReactElement => {
  const {
    handlePlayAgain,
    handleSetHost,
    handleRevealResults,
    handleSetFinale,
  } = props;
  const resetGuess = useResetRecoilState(playerGuessState);
  const [showNewHostModal, setShowNewHostModal] = useRecoilState(
    showNewHostModalState,
  );
  const lobbyData = useRecoilValue(lobbyState);
  const revealResults = useRecoilValue(revealResultsState);
  const [playerDict] = useState<PlayerDictionary>(
    getPlayerDictionary(lobbyData.players),
  );
  const [guesses, , reloadGuesses] = useLocalStorage('guesses', []);
  const [sortedDefinitions, setSortedDefinitions] = useState<
    DefinitionResultItem[]
  >(getSortedDefinitions(lobbyData, guesses as GuessItem[], playerDict));

  // Reset player's guess for next round
  useEffect(() => {
    resetGuess();
  }, []);

  // Create new sorted definitions array when player recieves guesses from host
  useEffect(() => {
    setSortedDefinitions(
      getSortedDefinitions(
        lobbyData,
        reloadGuesses() as GuessItem[],
        playerDict,
      ),
    );
  }, [lobbyData, revealResults]);

  return (
    <div className="postgame game-page">
      <h2>The Results!</h2>
      <Host>
        {!revealResults && (
          // Hide after reveal
          <p>
            Players can’t see the results yet, so it’s up to you to read them
            with pizzaz! We suggest saying, “The honorable mentions are...” for
            the definitions with no votes
          </p>
        )}
        <div className="word-display">
          <p className="word">{lobbyData.word}</p>
        </div>
        <div className="round-results">
          {sortedDefinitions.map((definitionResult, key) => (
            <DefinitionResult key={key} definitionResult={definitionResult} />
          ))}
        </div>
        <div className="endgame-container">
          {!revealResults ? (
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
                <button onClick={handleSetFinale}>Go to Finale</button>
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
              <button className="play-again" onClick={handlePlayAgain}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </Host>
      <Player>
        {!revealResults ? (
          // Before reveal
          <>
            <p>
              Your host is now going to read the results! Did you guess the
              right one? How did your definition do? Did it reign supreme?
            </p>
            <div className="word-display">
              <p>{lobbyData.word}</p>
            </div>
          </>
        ) : (
          // After reveal
          <>
            <div className="word-display">
              <p>{lobbyData.word}</p>
            </div>
            <div className="round-results">
              {sortedDefinitions.map((definitionResult, key) => (
                <DefinitionResult
                  key={key}
                  definitionResult={definitionResult}
                />
              ))}
            </div>
          </>
        )}
        <PlayerList hidePoints={!revealResults} />
      </Player>
    </div>
  );
};

const DefinitionResult = (props: DefinitionResultProps): React.ReactElement => {
  const { username, definition, points, guesses } = props.definitionResult;
  return (
    <>
      {definition !== '' ? (
        // Player submitted a definition
        <div className="definition-result">
          <div className="vote-align">
            <div className="author-box">
              <span className="result-username">{username} </span>
              <span>wrote:</span>
            </div>
            <p className="result-votes">
              {points} vote{points === 1 ? '' : 's'}
            </p>
          </div>
          <p className="result-definition">{definition}</p>
          <p className="who-voted-p">
            {guesses.length > 0 ? 'Who voted:' : 'No votes'}
          </p>
          <div className="who-voted-box">
            {guesses.map((guess, key) => (
              <div key={key} className="guess-names">
                <p className="who-voted">{guess}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Player didn't submit a definition
        <div className="definition-result">
          <div className="vote-align">
            <div className="author-box">
              <span className="result-username">{username} </span>
            </div>
          </div>
          <p className="result-definition">No submission!</p>
        </div>
      )}
    </>
  );
};

export default Postgame;

interface PostgameProps {
  handlePlayAgain: () => void;
  handleSetHost: (hostId: string, guesses: GuessItem[]) => void;
  handleSetFinale: () => void;
  handleRevealResults: (guesses: GuessItem[]) => void;
}

interface DefinitionResultProps {
  definitionResult: DefinitionResultItem;
}

interface PlayerDictionary {
  [Key: string]: string;
}

interface DefinitionDictionary {
  [Key: number]: DefinitionResultItem;
}

interface DefinitionResultItem {
  username: string;
  playerId: string;
  definition: string;
  definitionId: number;
  guesses: string[];
  points: number;
}
