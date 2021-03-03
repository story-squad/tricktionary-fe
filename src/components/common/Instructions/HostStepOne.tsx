import React from 'react';

const HostStepOne = (): React.ReactElement => {
  return (
    <div className="instructions-step">
      <p>
        Choose a word while your friends are joining the lobby. Set a timer and
        read the word aloud to your friends. Then say,{' '}
        <strong>
          “Your job is to come up with a plausible dictionary-sounding
          definition. You get 1 point if you vote for the correct definition and
          1 point if someone votes for your definition”
        </strong>{' '}
        and start the game when everyone is ready!
      </p>
    </div>
  );
};

export default HostStepOne;
