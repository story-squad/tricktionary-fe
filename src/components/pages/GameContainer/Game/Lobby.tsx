import jwt from 'jsonwebtoken';
import React, { SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../../../hooks';
import '../../../../styles/components/pages/Lobby.scss';
//styles
import '../../../../styles/gameContainer.scss';
import { DecodedToken } from '../../../../types/commonTypes';
import { usernameIsValid } from '../../../../utils/validation';
import { Input } from '../../../common/Input';

const Lobby = (props: LobbyProps): React.ReactElement => {
  const location = useLocation();
  const [token] = useLocalStorage<string>('token', '');

  //set up the username details
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
    watch,
  } = useForm({
    mode: 'onSubmit',
  });

  // Join a game if the lobbyCode is provided in the URL
  useEffect(() => {
    const decodedToken: DecodedToken = jwt.decode(token) as DecodedToken;
    let lobbyUrl = location.pathname;
    if (lobbyUrl !== '/') {
      lobbyUrl = lobbyUrl.substring(1, 5);
    }
    // If the user is entering a new game, join. Else, let the login event handle joining
    if (lobbyUrl !== decodedToken?.lob) {
      props.handleJoinLobby(null, lobbyUrl);
    }
  }, []);

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.handleSetUsername(e.target.value);
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setLobbyCode(e.target.value.toUpperCase());
  };

  return (
    <div className="lobby game-page">
      <h2>Welcome!</h2>
      <p>
        Please enter your name and lobby code to join a game or you can host a
        new game.
      </p>
      {/* <label htmlFor="username">First Name:</label> */}
      <Input
        id="username"
        name="username"
        value={props.username}
        label="First Name"
        register={register}
        onChange={handleChangeUsername}
      ></Input>
      {/* <input
        id="username"
        name="username"
        value={props.username}
        onChange={handleChangeUsername}
      /> */}
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
          disabled={!usernameIsValid(props.username)}
        >
          Join Lobby
        </button>
        <p className="or">- OR -</p>
        <button
          className="host lobby-button"
          onClick={props.handleCreateLobby}
          disabled={!usernameIsValid(props.username)}
        >
          Host New Game
        </button>
      </form>
    </div>
  );
};

export default Lobby;

interface LobbyProps {
  username: string;
  lobbyCode: string;
  handleSetUsername: (newUsername: string) => void;
  setLobbyCode: React.Dispatch<SetStateAction<string>>;
  handleCreateLobby: (e: React.MouseEvent) => void;
  handleJoinLobby: (e: null | React.MouseEvent, optionalCode: string) => void;
}
