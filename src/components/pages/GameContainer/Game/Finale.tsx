import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../../state';
import {
  FinaleDefinition,
  PlayerItem,
  TopPlayers,
} from '../../../../types/gameTypes';

const getTopPlayers = (
  players: PlayerItem[],
  definitions: FinaleDefinition[],
): TopPlayers => {
  // Get the top 3 players by points
  players = players.sort((a, b) => (a.points < b.points ? 1 : -1));
  // Make it easy to lookup the definition by player id
  const definitionDict: { [key: string]: string } = {};
  definitions.forEach((defItem) => {
    definitionDict[defItem.playerId] = defItem.definition;
  });
  // Create and return TopPlayers
  return {
    first: {
      id: players[0].id,
      username: players[0].username,
      points: players[0].points,
      definition: definitionDict[players[0].id],
    },
    second: {
      id: players[1].id,
      username: players[1].username,
      points: players[1].points,
      definition: definitionDict[players[1].id],
    },
    third: {
      id: players[2].id,
      username: players[2].username,
      points: players[2].points,
      definition: definitionDict[players[2].id],
    },
  };
};

const Finale = (): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const [topPlayers] = useState(getTopPlayers(lobbyData));

  return (
    <div className="postgame game-page">
      <div className="example-podium second-place">
        <p>{topPlayers.second.username}</p>
        <p>{topPlayers.second.points}</p>
        <p>{topPlayers.second.definition}</p>
      </div>
      <div className="example-podium first-place">
        <p>{topPlayers.first.username}</p>
        <p>{topPlayers.first.points}</p>
        <p>{topPlayers.first.definition}</p>
      </div>
      <div className="example-podium third-place">
        <p>{topPlayers.third.username}</p>
        <p>{topPlayers.third.points}</p>
        <p>{topPlayers.third.definition}</p>
      </div>
    </div>
  );
};

export default Finale;
