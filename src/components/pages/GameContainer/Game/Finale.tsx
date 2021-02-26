import React, { useEffect, useState } from 'react';
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
      username: playerDict[lobbyData.topThree[0]?.user_id],
      definition: lobbyData.topThree[0]?.definition,
    },
    second: {
      username: playerDict[lobbyData.topThree[1]?.user_id],
      definition: lobbyData.topThree[1]?.definition,
    },
    third: {
      username: playerDict[lobbyData.topThree[2]?.user_id],
      definition: lobbyData.topThree[2]?.definition,
    },
  };
};

const Finale = (): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const [topPlayers, setTopPlayers] = useState(getTopPlayers(lobbyData));

  useEffect(() => {
    setTopPlayers(getTopPlayers(lobbyData));
  }, [lobbyData]);

  return (
    <div className="finale game-page">
      <div className="place-bars">
        {topPlayers.second.username !== undefined && (
          <div className="example-podium second-place">
            <p>{topPlayers.second.username}</p>
            <p>{topPlayers.second.definition}</p>
          </div>
        )}
        {topPlayers.first.username !== undefined && (
          <div className="example-podium first-place">
            <p>{topPlayers.first.username}</p>
            <p>{topPlayers.first.definition}</p>
          </div>
        )}
        {topPlayers.third.username !== undefined && (
          <div className="example-podium third-place">
            <p>{topPlayers.third.username}</p>
            <p>{topPlayers.third.definition}</p>
          </div>
        )}
      </div>
      <div className="podium">&nbsp;</div>
    </div>
  );
};

export default Finale;
