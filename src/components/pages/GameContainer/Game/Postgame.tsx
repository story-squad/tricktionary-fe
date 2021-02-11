import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocalStorage } from '../../../../hooks';
import { lobbyState } from '../../../../state';
import { GuessItem, LobbyData, PlayerItem } from '../../../../types/gameTypes';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';
import SetHost from '../../../common/SetHost/SetHost';
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
    username: 'Real Definition',
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
      if (guess.player !== definitions[guess.guess].playerId) {
        definitions[guess.guess].points += 1;
      }
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
  const { handlePlayAgain, handleSetHost } = props;
  const lobbyData = useRecoilValue(lobbyState);
  const [playerDict] = useState<PlayerDictionary>(
    getPlayerDictionary(lobbyData.players),
  );
  const [guesses] = useLocalStorage('guesses', []);
  const [sortedDefinitions] = useState<DefinitionResultItem[]>(
    getSortedDefinitions(lobbyData, guesses as GuessItem[], playerDict),
  );

  return (
    <div className="postgame game-page">
      <Host>
        <h2>It&apos;s time for the results!</h2>
        <p>
          Here are the results. They are displayed from least votes to most,
          with the REAL defintion displayed at the end. The names of who voted
          for each definiton is also provided.
        </p>
        <div className="word-display">
          <p>{lobbyData.word}</p>
        </div>
        <div className="round-results">
          {sortedDefinitions.map((definitionResult, key) => (
            <DefinitionResult key={key} definitionResult={definitionResult} />
          ))}
        </div>
        <SetHost players={lobbyData.players} handleSetHost={handleSetHost} />
        <button onClick={handlePlayAgain}>Play Again</button>
      </Host>
      <Player>
        <h2>It&apos;s time for the results!</h2>
        <p>
          Your host is now going to read the results! Did you guess the right
          one? How did your definition do? Did it reign supreme?
        </p>
        <div className="word-display">
          <p>{lobbyData.word}</p>
        </div>
        <PlayerList />
      </Player>
    </div>
  );
};

const DefinitionResult = (props: DefinitionResultProps): React.ReactElement => {
  const { username, definition, points, guesses } = props.definitionResult;
  return (
    <div className="definition-result">
      <div className="vote-align">
        <div className="author-box">
          <span className="result-username">{username} </span>
          <span>wrote:</span>
        </div>
        <p className="result-votes">{points} votes</p>
      </div>
      <p className="result-definition">{definition}</p>
      {guesses.map((guess, key) => (
        <div key={key} className="guess-names">
          <p>Who voted: </p>
          <p className="who-voted">{guess}</p>
        </div>
      ))}
    </div>
  );
};

export default Postgame;

interface PostgameProps {
  handlePlayAgain: () => void;
  handleSetHost: (hostId: string) => void;
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
