import axios from 'axios';
import gsap from 'gsap';
import React, { useEffect, useState } from 'react';
import { BotItem } from '../../../../../types/gameTypes';
import { STORYSQUAD_AI_API_URL } from '../../../../../utils/constants';

const AlphaBotSettings = (props: AlphaBotProps): React.ReactElement => {
  const [enableBot, setEnableBot] = useState(false);
  const [botList, setBotList] = useState([]);
  const [loadingBots, setLoadingBots] = useState(true);

  const handleSetAlphaBot = () => {
    setEnableBot(!enableBot);
  };

  // Get botlist from API
  useEffect(() => {
    axios
      .get(STORYSQUAD_AI_API_URL + '/zetabot/botlist')
      .then((res) => {
        setBotList(res.data);
        setLoadingBots(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Check if we have bots selected for future rounds
  useEffect(() => {
    if (props.lobbyData.bots.length > 0) {
      setEnableBot(true);
    }
  }, []);

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

      {enableBot &&
        (loadingBots ? (
          <div className="select-bot">Loading Bots...</div>
        ) : (
          <div className="select-bot">
            {botList.map((bot, index) => {
              return (
                <AlphaBotList
                  bot={`${bot}`}
                  botID={`${bot}-${index}`}
                  lobbyCode={props.lobbyCode}
                  key={index}
                  socket={props.socket}
                  activeBots={props.lobbyData.bots}
                />
              );
            })}
          </div>
        ))}
    </div>
  );
};

//* Component for the Alphabot list
const AlphaBotList = (props: AlphaBotListProps): React.ReactElement => {
  const { bot, botID, lobbyCode, socket, activeBots } = props;

  const [enableBot, setEnableBot] = useState(false);

  const handleSetAlphaBot = () => {
    setEnableBot(!enableBot);
    handleAddBot(enableBot, lobbyCode);
  };

  //* Add some smoothing effects
  useEffect(() => {
    gsap.from(`#${botID}-box`, { opacity: 0 });
  }, []);

  // If a bot is in the game, preselect it
  useEffect(() => {
    activeBots.some((element: BotItem) => {
      if (element.botName === bot) {
        setEnableBot(true);
      }
    });
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
  socket: any;
  lobbyData: any;
}

interface AlphaBotListProps {
  bot: string;
  botID: string;
  lobbyCode: string;
  socket: any;
  activeBots: Array<BotItem>;
}
