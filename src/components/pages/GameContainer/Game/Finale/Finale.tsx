import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import finaleBanner from '../../../../../assets/finaleBanner.png';
import { lobbyState } from '../../../../../state/gameState';
import {
  getFinaleNoDefinitionText,
  getTopPlayers,
} from '../../../../../utils/helpers';
import { ProTip } from '../../../../common';

const Finale = (): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const [topPlayers] = useState(getTopPlayers(lobbyData));

  return (
    <section className="finale game-page">
      <ProTip
        message={'Much like statistics, 99% of these definitions are made up'}
      />
      {console.log(topPlayers)}
      <img
        className="finale-banner"
        src={finaleBanner}
        alt="It's Time to Crown a Champion!"
        role="heading"
        aria-level={1}
      />
      <div className="place-bars">
        {topPlayers.second.username !== undefined && (
          <div className="stack second-place-stack">
            <div className="def-card second-def-card">
              {topPlayers.second.definition !== '' ? (
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
              {topPlayers.first.definition !== '' ? (
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
              {topPlayers.third.definition !== '' ? (
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
        We&apos;re still in beta-testing and we&apos;d love to hear any ideas
        you have!
      </p>
      <a
        target="_blank"
        href="https://forms.gle/Nj3kMpKQpWZU9gxq7"
        rel="noreferrer"
      >
        Feedback Form
      </a>
    </section>
  );
};

export default Finale;
