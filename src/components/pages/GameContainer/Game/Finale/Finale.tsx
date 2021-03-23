import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import finaleBanner from '../../../../../assets/finaleBanner.png';
import { lobbyState } from '../../../../../state';
import {
  getFinaleNoDefinitionText,
  getTopPlayers,
} from '../../../../../utils/helpers';
import { ProTip } from '../../../../common/ProTip';

const Finale = (): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const [topPlayers] = useState(getTopPlayers(lobbyData));

  return (
    <div className="finale game-page">
      <ProTip
        message={'Much like statistics, 99% of these definitions are made up'}
      />
      {console.log(topPlayers)}
      <img className="finale-banner" src={finaleBanner} />
      <div className="place-bars">
        {topPlayers.second.username !== undefined && (
          <div className="stack second-place-stack">
            <div className="def-card second-def-card">
              {topPlayers.second.definition !== undefined ? (
                <p>
                  {topPlayers.second.word} does not mean:{' '}
                  {topPlayers.second.definition}
                </p>
              ) : (
                <p>{getFinaleNoDefinitionText()}</p>
              )}
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
              {topPlayers.first.definition !== undefined ? (
                <p>
                  {topPlayers.first.word} does not mean:{' '}
                  {topPlayers.first.definition}
                </p>
              ) : (
                <p>{getFinaleNoDefinitionText()}</p>
              )}
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
              {topPlayers.third.definition !== undefined ? (
                <p>
                  {topPlayers.third.word} does not mean:{' '}
                  {topPlayers.third.definition}
                </p>
              ) : (
                <p>{getFinaleNoDefinitionText()}</p>
              )}
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
