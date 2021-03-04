import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import finaleBanner from '../../../../../assets/finaleBanner.png';
import { lobbyState } from '../../../../../state';
import { getTopPlayers } from '../../../../../utils/helpers';

const Finale = (): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const [topPlayers] = useState(getTopPlayers(lobbyData));

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
              <div className="place-img second-img">
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
      <br />
      <p className="feedback">
        {`We're still in beta-testing and we'd love to hear any ideas you have!`}{' '}
        <a
          target="_blank"
          href="https://forms.gle/Nj3kMpKQpWZU9gxq7"
          rel="noreferrer"
        >
          {' '}
          <h3>Feedback Form</h3>
        </a>
      </p>
    </div>
  );
};

export default Finale;
