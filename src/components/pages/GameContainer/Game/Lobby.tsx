import React, { SetStateAction, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//styles
import '../../../../styles/gameContainer.scss';
import '../../../../styles/components/pages/Lobby.scss';

//image
import logo from '../../../../assets/TricktionaryLogo.png';

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
      <header>
        <img className="trick-logo" src={logo} />
        <p>The game where the wrong definition could lead you to greatness.</p>
      </header>
      <div className="game-styles">
        <h2>Welcome!</h2>
        <p>
          Please enter your name and lobby code to join a game or you can host a
          new game.
        </p>
        <label htmlFor="username">First Name:</label>
        <input
          id="username"
          name="username"
          value={props.username}
          onChange={handleChangeUsername}
        />
        <br />
        <form className="start-game">
          <label htmlFor="lobby-code">Lobby Code</label>
          <input
            id="lobby-code"
            name="lobby-code"
            value={props.lobbyCode}
            onChange={handleChangeCode}
            maxLength={4}
            placeholder="Enter lobby code to join a game!"
          />
          <br />
          <button
            className="join lobby-button"
            onClick={(e) => props.handleJoinLobby(e, '')}
          >
            Join Lobby
          </button>

          <p className="or">- OR -</p>
          <button
            className="host lobby-button"
            onClick={props.handleCreateLobby}
          >
            Host New Game
          </button>
        </form>
      </div>
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
