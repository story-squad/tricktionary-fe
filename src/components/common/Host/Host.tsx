import React from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState, playerIdState } from '../../../state';
import { HOCProps } from '../../../types/commonTypes';

const Host = (props: HOCProps): React.ReactElement => {
  const { children } = props;
  const lobbyData = useRecoilValue(lobbyState);
  const playerId = useRecoilValue(playerIdState);
  const isHost = lobbyData.host === playerId;
  return <>{isHost && children}</>;
};

export default Host;
