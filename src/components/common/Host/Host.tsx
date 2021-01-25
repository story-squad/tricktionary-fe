import React from 'react';
import { HostPlayerProps } from '../commonTypes';

const Host = (props: HostPlayerProps): React.ReactElement => {
  const { isHost, children } = props;
  return <>{isHost && children}</>;
};

export default Host;
