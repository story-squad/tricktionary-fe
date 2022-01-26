import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import finaleBanner from '../../../../../assets/wordhoax-finale-banner.png';
import { lobbyState } from '../../../../../state/gameState';
import {
  getFinaleNoDefinitionText,
  getTopPlayers,
} from '../../../../../utils/helpers';
import { ProTip, View } from '../../../../common';
import SaveScreenshot from './SaveScreenshot';

const Finale = (): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const [topPlayers] = useState(getTopPlayers(lobbyData));

  //* Used for saving a screenshot from a button
  const podiumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to('.finale-banner', {
      duration: 1.5,
      y: -20,
      repeat: -1,
      yoyo: true,
    });

    let firstPlaceDelay = 0;
    let secondPlaceDelay = 0;

    if (topPlayers?.third?.username !== undefined) {
      firstPlaceDelay = 2;
      secondPlaceDelay = 1;

      gsap.from('.third-place-stack .example-podium', {
        opacity: 0,
        height: 0,
        duration: 1,
        delay: 1,
        ease: 'bounce',
      });

      gsap.from('.third-place-stack .place-img', {
        opacity: 0,
        scale: 0,
        duration: 2,
        delay: 2,
        ease: 'elastic(1, 0.5)',
      });

      gsap.from('.third-place-stack .def-card', {
        scale: 0,
        duration: 1,
        delay: 2,
        ease: 'elastic(1, 0.5)',
      });
    }

    if (topPlayers?.second?.username !== undefined) {
      if (topPlayers?.third?.username === undefined) {
        firstPlaceDelay = 1;
      }

      gsap.from('.second-place-stack .example-podium', {
        opacity: 0,
        height: 0,
        duration: 1,
        delay: 1,
        ease: 'bounce',
      });

      gsap.from('.second-place-stack .place-img', {
        opacity: 0,
        scale: 0,
        duration: 2,
        delay: secondPlaceDelay + 2,
        ease: 'elastic(1, 0.5)',
      });

      gsap.from('.second-place-stack .def-card', {
        scale: 0,
        duration: 1,
        delay: secondPlaceDelay + 2,
        ease: 'elastic(1, 0.5)',
      });
    }

    if (topPlayers?.first?.username !== undefined) {
      gsap.from('.first-place-stack .example-podium', {
        opacity: 0,
        height: 0,
        duration: 1,
        delay: 1,
        ease: 'bounce',
      });

      gsap.from('.first-place-stack .place-img', {
        opacity: 0,
        scale: 0,
        duration: 2,
        delay: firstPlaceDelay + 2,
        ease: 'elastic(1, 0.5)',
      });

      gsap.from('.first-place-stack .def-card', {
        scale: 0,
        duration: 1,
        delay: firstPlaceDelay + 2,
        ease: 'elastic(1, 0.5)',
      });
    }
  }, []);

  return (
    <div className="finale game-page">
      <ProTip
        message={'Much like statistics, 99% of these definitions are made up'}
      />

      <img
        className="finale-banner"
        src={finaleBanner}
        alt="It's Time to Crown a Champion!"
        role="heading"
        aria-level={1}
      />

      <div className="finale-podiums" ref={podiumRef}>
        <div className="place-bars">
          <View show={topPlayers?.second?.username !== undefined}>
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
          </View>
          <View show={topPlayers?.first?.username !== undefined}>
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
          </View>
          <View show={topPlayers?.third?.username !== undefined}>
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
          </View>
        </div>

        <div className="podium">&nbsp;</div>
      </div>

      <SaveScreenshot podiumRef={podiumRef} />

      <div className="feedback-container">
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
      </div>
    </div>
  );
};

export default Finale;
