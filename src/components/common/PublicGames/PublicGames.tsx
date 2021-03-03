import React from 'react';
import {
  PUBLIC_MEETING_URL,
  PUBLIC_STREAM_URL,
} from '../../../utils/constants';

const PublicGames = (): React.ReactElement => {
  return (
    <>
      {(PUBLIC_MEETING_URL !== '' || PUBLIC_STREAM_URL !== '') && (
        <div className="game-page public-games margin-bottom">
          <h2>Play a Game With the Tricktionary Team</h2>
          {PUBLIC_MEETING_URL !== '' && (
            <>
              <a href={PUBLIC_MEETING_URL} target="_blank" rel="noreferrer">
                Join us on Zoom
              </a>
              <br />
            </>
          )}
          {PUBLIC_STREAM_URL !== '' && (
            <a href={PUBLIC_STREAM_URL} target="_blank" rel="noreferrer">
              Watch our livestream
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default PublicGames;
