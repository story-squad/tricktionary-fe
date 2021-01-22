import React, { SetStateAction, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Lobby = (props: LobbyProps): React.ReactElement => {
  const location = useLocation();

  // Join a lobby if the lobbyCode is provided in the URL
  useEffect(() => {
    let lobbyUrl = location.pathname;
    if (lobbyUrl !== '/') {
      lobbyUrl = lobbyUrl.substring(1, 5);
      props.handleJoinLobby(null, lobbyUrl);
    }
  }, []);

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setUsername(e.target.value);
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setLobbyCode(e.target.value.toUpperCase());
  };

  return (
    <div className="lobby game-page">
      <h2>Lobby</h2>
      <label htmlFor="username">Name</label>
      <input
        id="username"
        name="username"
        value={props.username}
        onChange={handleChangeUsername}
      />
      <label htmlFor="lobby-code">Room Code</label>
      <input
        id="lobby-code"
        name="lobby-code"
        value={props.lobbyCode}
        onChange={handleChangeCode}
        maxLength={4}
      />
      <button onClick={props.handleCreateLobby}>New Game</button>
      <button onClick={(e) => props.handleJoinLobby(e, '')}>Join Game</button>
    </div>
  );
};

export default Lobby;

interface LobbyProps {
  username: string;
  lobbyCode: string;
  setUsername: React.Dispatch<SetStateAction<string>>;
  setLobbyCode: React.Dispatch<SetStateAction<string>>;
  handleCreateLobby: (e: React.MouseEvent) => void;
  handleJoinLobby: (e: null | React.MouseEvent, optionalCode: string) => void;
}

interface ParamTypes {
  lobbyCode: string;
}
