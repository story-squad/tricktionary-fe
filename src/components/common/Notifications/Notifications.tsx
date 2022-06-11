import { UserAddOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { playerIdState } from '../../../state/gameState';
import { LobbyData, NotificationItem } from '../../../types/gameTypes';

const isPlayerHost = (lobbyData: LobbyData, player: string) => {
  if (lobbyData.host === player) {
    return true;
  }

  return false;
};

const Notifications = (props: NotificationProps): React.ReactElement => {
  const { socket, lobbyData } = props;

  const playerId = useRecoilValue(playerIdState);

  //* Function to open the notifications box
  const openNotification = (data: NotificationItem) => {
    const args = {
      message: data.message,
      description: data.description,
      icon: <UserAddOutlined />,
      className: data.className,
    };

    notification.open({
      ...args,
      placement: 'bottomLeft',
    });
  };

  useEffect(() => {
    socket.on(
      'receive-notification',
      (data: NotificationItem, socketID: number) => {
        if (socketID != socket.id) {
          openNotification(data);
        }
      },
    );
  }, [socket]);

  return <div></div>;
};

export default Notifications;

interface NotificationProps {
  socket: any;
  lobbyData: LobbyData;
}
