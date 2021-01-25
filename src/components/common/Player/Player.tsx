import React from 'react';
import { HostPlayerProps } from '../commonTypes';

const Player = (props: HostPlayerProps): React.ReactElement => {
  const { isHost, children } = props;
  return <>{!isHost && children}</>;
};

export default Player;
