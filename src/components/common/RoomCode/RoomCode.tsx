import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../state/gameState';
import { REACT_APP_URL } from '../../../utils/constants';

const RoomCode = (): React.ReactElement => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState(0);
  const lobbyData = useRecoilValue(lobbyState);

  const handleClickCopy = () => {
    setCopiedUrl(true);
    clearTimeout(copiedTimeout);
    setCopiedTimeout(
      window.setTimeout(() => {
        setCopiedUrl(false);
      }, 2000),
    );
  };

  return (
    <div className="invite-code">
      <p>Invite Code:</p>
      <p className="room-code">{lobbyData.lobbyCode}</p>
      <div className="copy-to-clipboard">
        <CopyToClipboard text={`${REACT_APP_URL}/${lobbyData.lobbyCode}`}>
          <button
            className={copiedUrl ? 'copied' : ''}
            onClick={handleClickCopy}
          >
            <FontAwesomeIcon icon={faCopy} />
            {copiedUrl && <p>Link copied!</p>}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default RoomCode;
