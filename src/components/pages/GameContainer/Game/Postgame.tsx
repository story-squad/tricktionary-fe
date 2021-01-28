import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isHostState, lobbyState } from '../../../../state';
import { guessesState } from '../../../../state/guessesState';
import { GuessItem, LobbyData, PlayerItem } from '../gameTypes';

const getSortedDefinitions = (
  lobbyData: LobbyData,
  guesses: GuessItem[],
  playerDict: PlayerDictionary,
): DefinitionResult[] => {
  // Create a definition dictionary to easily map all player guesses to each definition
  const definitions: DefinitionDictionary = {};
  lobbyData.players.forEach((player) => {
    definitions[player.definitionId as number] = {
      username: player.username,
      definition: player.definition,
      definitionId: player.definitionId as number,
      guesses: [],
      points: 0,
    };
  });
  // Add real definition
  definitions[0] = {
    username: 'Real Definition',
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
  const { handlePlayAgain } = props;
  const isHost = useRecoilValue(isHostState);
  const lobbyData = useRecoilValue(lobbyState);
  const [playerDict] = useState<PlayerDictionary>(
    getPlayerDictionary(lobbyData.players),
  );
  const guesses = useRecoilValue(guessesState);
  const [sortedDefinitions] = useState<DefinitionResult[]>(
    getSortedDefinitions(lobbyData, guesses, playerDict),
  );

  return (
    <div className="postgame game-page">
      <h2>Postgame</h2>
      <div className="word-display">
        <p>Word:</p>
        <p>{lobbyData.word}</p>
      </div>
      {isHost && <button onClick={handlePlayAgain}>Play Again</button>}
      {!isHost && <p>Waiting on host to start new game...</p>}
    </div>
  );
};

export default Postgame;

interface PostgameProps {
  handlePlayAgain: () => void;
}

interface PlayerDictionary {
  [Key: string]: string;
}

interface DefinitionDictionary {
  [Key: number]: DefinitionResult;
}

interface DefinitionResult {
  username: string;
  definition: string;
  definitionId: number;
  guesses: string[];
  points: number;
}
