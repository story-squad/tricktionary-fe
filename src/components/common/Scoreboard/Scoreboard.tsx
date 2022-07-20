import { gsap } from 'gsap';
import React, { useEffect } from 'react';
import {
  LobbyData,
  PlayerItem,
  RoundScoreItem,
} from '../../../types/gameTypes';
import { isValidPlayer } from '../../../utils/helpers';

const playerClassName = (player: PlayerItem, playerId: string) => {
  const currentPlayer = player.id === playerId ? 'current' : '';
  const disconnected = player.connected === false ? ' disconnected' : '';

  return currentPlayer + disconnected;
};

const isPlayerHost = (lobbyData: LobbyData, player: PlayerItem) => {
  if (lobbyData.host === player.id) {
    return true;
  }

  return false;
};

const Scoreboard = (props: ScoreboardProps): React.ReactElement => {
  const { lobbyData, playerId } = props;

  const playerList = [
    ...lobbyData.players
      .filter(
        (player: PlayerItem) =>
          isValidPlayer(player) && !isPlayerHost(lobbyData, player),
      )
      .sort((a, b) => b.points - a.points),
  ];
  const { hidePoints, revealBoard } = props;

  //* Helper for placement ranking
  const listPlayerCount = playerList.length - 1;

  //* Hide Scoreboard
  const handleHideScoreboard = () => {
    gsap.to('.inner-scoreboard', { y: 100, opacity: 0, duration: 0.3 });
    gsap.to('.player-scoreboard', { opacity: 0, duration: 0.3 });
    gsap.to('.player-scoreboard', {
      display: 'none',
      duration: 0.1,
      delay: 0.3,
    });
  };

  //* Show Scoreboard
  const handleShowScoreboard = () => {
    gsap.to('.player-scoreboard', {
      display: 'flex',
      duration: 0.1,
    });
    gsap.to('.inner-scoreboard', { y: 0, opacity: 1, duration: 0.3 });
    gsap.to('.player-scoreboard', { opacity: 1, duration: 0.3 });
  };

  //* After the reveal, show the scores
  useEffect(() => {
    if (revealBoard) {
      handleShowScoreboard();
    }
  }, [revealBoard]);

  return (
    <>
      <button className="show-scoreboard" onClick={handleShowScoreboard}>
        Check Scores
      </button>

      <div className="player-scoreboard">
        <div className="overlay"></div>
        <div className="inner-scoreboard">
          <div className="scoreboard-heading">
            <h2>Scoreboard</h2>

            <button onClick={handleHideScoreboard}>close</button>
          </div>

          <div className="scoreboard-table">
            <table cellSpacing={0}>
              <thead>
                <tr className="row heading">
                  <td className="placing">🏆</td>
                  <td className="username">Codename</td>
                  {lobbyData.rounds.length > 0 &&
                    lobbyData.rounds.map((round) => {
                      return (
                        <td className="round" key={round.roundNum}>
                          Rnd {round.roundNum}
                        </td>
                      );
                    })}
                  <td className="total">Total</td>
                </tr>
              </thead>
              <tbody>
                {lobbyData.players.length <= 1 ? (
                  <tr className="row player no-players">
                    <td colSpan={4}>No Players in yet</td>
                  </tr>
                ) : (
                  playerList.map((player: PlayerItem, index) => {
                    const playerPlace = player.playerPlacing;
                    let curPlayerPlacing = playerPlace.toString();

                    if (playerList.length > 1 && index !== 0) {
                      if (
                        playerList[index - 1].playerPlacing ===
                        player.playerPlacing
                      ) {
                        curPlayerPlacing = `T${playerPlace}`;
                      }
                    }

                    return (
                      <tr
                        className={`row player ${playerClassName(
                          player,
                          playerId,
                        )}`}
                        key={player.id}
                      >
                        <td className="placing">
                          {hidePoints ? '?' : curPlayerPlacing}
                        </td>
                        <td className="username">{player.username}</td>
                        {lobbyData.rounds.length > 0 &&
                          lobbyData.rounds.map((round) => {
                            const curRoundScore = round.scores.filter(
                              (x: RoundScoreItem) => x.playerId === player.id,
                            )[0];

                            const curRound =
                              round.roundNum ===
                              String(lobbyData.rounds.length);

                            return (
                              <td className="round" key={round.roundNum}>
                                {curRound
                                  ? hidePoints
                                    ? '?'
                                    : `${curRoundScore.score}`
                                  : curRoundScore.score}
                              </td>
                            );
                          })}
                        <td className="total">
                          {hidePoints ? '?' : `${player.points}`}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Scoreboard;

interface ScoreboardProps {
  hidePoints?: boolean;
  revealBoard?: boolean;
  lobbyData: LobbyData;
  playerId: string;
}
