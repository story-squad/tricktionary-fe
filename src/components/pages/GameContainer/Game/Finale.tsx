import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../../state';
import { LobbyData, TopPlayers } from '../../../../types/gameTypes';

//import assets
import finaleBanner from '../../../../assets/finaleBanner.png';

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
      <img className="finale-banner" src={finaleBanner} />
      <div className="place-bars">
        {topPlayers.second.username !== undefined && (
          <div className="stack second-place-stack">
            <div className="def-card second-def-card">
              <p className="second-name">{topPlayers.second.definition}</p>
            </div>
            <div className="example-podium second-place">
              <div className="second-place-img second-img">
                <p className="second-name">{topPlayers.second.username}</p>
              </div>
            </div>
          </div>
        )}
        {topPlayers.first.username !== undefined && (
          <div className="stack first-place-stack">
            <div className="def-card first-def-card">
              <p>{topPlayers.first.definition}</p>
            </div>
            <div className="example-podium first-place">
              <div className="place-img first-img">
                <p className="first-name">{topPlayers.first.username}</p>
              </div>
            </div>
          </div>
        )}
        {topPlayers.third.username !== undefined && (
          <div className="stack third-place-stack">
            <div className="def-card third-def-card">
              <p>{topPlayers.third.definition}</p>
            </div>
            <div className="example-podium third-place">
              <div className="place-img third-img">
                <p className="third-name">{topPlayers.third.username}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="podium">&nbsp;</div>
    </div>
  );
};

export default Finale;
