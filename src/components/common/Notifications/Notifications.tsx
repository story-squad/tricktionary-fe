import { UserAddOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { LobbyData, NotificationItem } from '../../../types/gameTypes';

const Notifications = (props: NotificationProps): React.ReactElement => {
  const { socket } = props;

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
      (data: NotificationItem, socketID: string) => {
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
  socket: Socket;
  lobbyData: LobbyData;
}
