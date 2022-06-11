import axios from 'axios';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../../../state/gameState';

const BotSubmission = (props: BotSubmissionProps): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);

  //* Submit Bot Definition
  useEffect(() => {
    lobbyData.bots.forEach((bot) => {
      const APIURL = `https://hoaxbot3000.herokuapp.com/zetabot/${lobbyData.category}/${lobbyData.word}/${bot.botName}`;

      axios
        .get(APIURL)
        .then((res) => {
          console.log('BotSubmission.tsx - line 17 - bot response', res);
          props.handleBotSubmitDefinition(res.data, bot.id);
        })
        .catch((err) => {
          console.log(err.message);
        });

      // props.handleBotSubmitDefinition(`My name is ${bot.botName}`, bot.id);
    });
  }, []);

  return <></>;
};

export default BotSubmission;

interface BotSubmissionProps {
  handleBotSubmitDefinition: (definition: string, botID: string) => void;
}
