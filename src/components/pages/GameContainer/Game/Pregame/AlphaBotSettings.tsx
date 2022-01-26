import gsap from 'gsap';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { REACT_APP_API_URL } from '../../../../../utils/constants';

// Create a socket connection to API
const socket = io.connect(REACT_APP_API_URL as string);

const AlphaBotSettings = (props: AlphaBotProps): React.ReactElement => {
  const [enableBot, setEnableBot] = useState(false);

  const handleSetAlphaBot = () => {
    setEnableBot(!enableBot);
  };

  const botNameList = [
    'bubblebot',
    'bubblebot_v2',
    'bubblebot_v3',
    'bubblebot_v4',
    'buzzkillbot',
    'originaltestbot',
  ];

  return (
    <div className="alphabot-setting">
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          id="enable-bot"
          checked={enableBot}
          onChange={handleSetAlphaBot}
        />

        <label htmlFor="enable-bot">Play With AlphaBot?</label>
      </div>

      {enableBot && (
        <div className="select-bot">
          {botNameList.map((bot, index) => {
            return (
              <AlphaBotList
                bot={`${bot}`}
                botID={`${bot}-${index}`}
                lobbyCode={props.lobbyCode}
                key={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

//* Component for the Alphabot list
const AlphaBotList = (props: AlphaBotListProps): React.ReactElement => {
  const { bot, botID, lobbyCode } = props;

  const [enableBot, setEnableBot] = useState(false);

  const handleSetAlphaBot = () => {
    setEnableBot(!enableBot);
    handleAddBot(enableBot, lobbyCode);
  };

  //* Add some smoothing effects
  useEffect(() => {
    gsap.from(`#${botID}-box`, { opacity: 0 });
  }, []);

  // Join game as Player
  const handleAddBot = (active: boolean, lobbyCode: string) => {
    let action;

    if (!active) {
      action = 'add';
    } else {
      action = 'remove';
    }

    socket.emit('manage alphabot', bot, botID, action, lobbyCode);
  };

  return (
    <div id={`${botID}-box`} className="checkbox-wrapper">
      <input
        type="checkbox"
        id={botID}
        checked={enableBot}
        onChange={handleSetAlphaBot}
      />

      <label htmlFor={botID}>{bot}</label>

      {enableBot && <span className="message">Added bot to players</span>}
    </div>
  );
};

export default AlphaBotSettings;

interface AlphaBotProps {
  lobbyCode: string;
}

interface AlphaBotListProps {
  bot: string;
  botID: string;
  lobbyCode: string;
}
