import React from 'react';
import { useRecoilValue } from 'recoil';

import { isHostState } from '../../../state/isHostAtom';
import { HostPlayerProps } from '../commonTypes';

const Player = (props: HostPlayerProps): React.ReactElement => {
  const { children } = props;
  const isHost = useRecoilValue(isHostState);
  return <>{!isHost && children}</>;
};

export default Player;
