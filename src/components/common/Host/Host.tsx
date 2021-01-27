import React from 'react';
import { useRecoilValue } from 'recoil';

import { isHostState } from '../../../state/isHostState';
import { HostPlayerProps } from '../commonTypes';

const Host = (props: HostPlayerProps): React.ReactElement => {
  const { children } = props;
  const isHost = useRecoilValue(isHostState);
  return <>{isHost && children}</>;
};

export default Host;
