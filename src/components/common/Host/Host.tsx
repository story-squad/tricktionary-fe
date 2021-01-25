import React from 'react';
import { HostPlayerProps } from '../commonTypes';

const Host = (props: HostPlayerProps): React.ReactChildren | null => {
  const { isHost, children } = props;
  if (isHost) {
    return children;
  } else {
    return null;
  }
};

export default Host;
