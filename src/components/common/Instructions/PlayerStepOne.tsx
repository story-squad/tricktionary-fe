import React from 'react';

const HostStepOne = (): React.ReactElement => {
  return (
    <div className="instructions-step">
      <p className="instructions">
        When the game starts,{' '}
        <strong>
          compose your best trick defintion to get other players to vote for it.
        </strong>{' '}
        Click “submit” before the time runs out!
      </p>
    </div>
  );
};

export default HostStepOne;
