import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../../state';
import { LobbyData, TopPlayers } from '../../../../types/gameTypes';

const getTopPlayers = (lobbyData: LobbyData): TopPlayers => {
  const playerDict: { [key: string]: string } = {};
  lobbyData.players.forEach((player) => {
    playerDict[player.id] = player.username;
  });
  // Create and return TopPlayers
  return {
    first: {
      username: playerDict[lobbyData.topThree[0]?.playerId],
      definition: lobbyData.topThree[0]?.definition,
    },
    second: {
      username: playerDict[lobbyData.topThree[1]?.playerId],
      definition: lobbyData.topThree[1]?.definition,
    },
    third: {
      username: playerDict[lobbyData.topThree[2]?.playerId],
      definition: lobbyData.topThree[2]?.definition,
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
        <p>{topPlayers.second.definition}</p>
      </div>
      <div className="example-podium first-place">
        <p>{topPlayers.first.username}</p>
        <p>{topPlayers.first.definition}</p>
      </div>
      <div className="example-podium third-place">
        <p>{topPlayers.third.username}</p>
        <p>{topPlayers.third.definition}</p>
      </div>
    </div>
  );
};

export default Finale;
