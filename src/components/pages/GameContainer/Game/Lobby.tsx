import React, { useEffect, useState } from 'react';

const Lobby = (props: LobbyProps): React.ReactElement => {
  return (
    <div className="lobby game-page">
      <h2>Lobby</h2>
      <label htmlFor="username">Name</label>
      <input
        id="username"
        name="username"
        value={props.username}
        onChange={props.handleChangeUsername}
      />
      <label htmlFor="lobby-code">Room Code</label>
      <input
        id="lobby-code"
        name="lobby-code"
        value={props.lobbyCode}
        onChange={props.handleChangeCode}
        maxLength={4}
      />
      <button onClick={props.handleCreateLobby}>New Game</button>
      <button>Join Game</button>
    </div>
  );
};

export default Lobby;

interface LobbyProps {
  username: string;
  lobbyCode: string;
  handleChangeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateLobby: (e: React.MouseEvent) => void;
}
