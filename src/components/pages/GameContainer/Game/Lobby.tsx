import jwt from 'jsonwebtoken';
import React, { SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../../../hooks';
import '../../../../styles/components/pages/Lobby.scss';
//styles
import '../../../../styles/gameContainer.scss';
import { DecodedToken } from '../../../../types/commonTypes';
import {
  lobbyCodeIsValid,
  usernameIsValid,
} from '../../../../utils/validation';
import { Input } from '../../../common/Input';

const Lobby = (props: LobbyProps): React.ReactElement => {
  const location = useLocation();
  const [token] = useLocalStorage<string>('token', '');

  //set up the form details
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
    const lobbyMessage = lobbyCodeIsValid(props.lobbyCode).message;
    const userMessage = usernameIsValid(e.target.value).message;
    if (usernameIsValid(e.target.value).valid) {
      if (lobbyCodeIsValid(props.lobbyCode).valid) {
        //if both the username and lobbycode are valid then clear the form error
        clearErrors();
      } else {
        //if the username is good and the lobbycode is invalid then use the lobbycode error
        setError('form', { type: 'manual', message: lobbyMessage });
      }
    }
    if (!usernameIsValid(e.target.value).valid) {
      //if the username is invalid use the username error
      setError('form', { type: 'manual', message: userMessage });
    }
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setLobbyCode(e.target.value.toUpperCase());
    const lobbyMessage = lobbyCodeIsValid(e.target.value).message;
    const userMessage = usernameIsValid(props.username).message;
    if (lobbyCodeIsValid(e.target.value).valid) {
      if (usernameIsValid(props.username).valid) {
        //if both the username and lobbycode are valid then clear the form error
        clearErrors();
      } else {
        //if the lobby is good and the username is invalid use the username error
        setError('form', { type: 'manual', message: userMessage });
      }
    }
    if (!lobbyCodeIsValid(e.target.value).valid) {
      //if the username is good and the lobbycode is invalid then use the lobbycode error
      setError('form', { type: 'manual', message: lobbyMessage });
    }
  };

  return (
    <div className="lobby game-page">
      <h2>Welcome!</h2>
      <p>
        Please enter your name and lobby code to join a game or you can host a
        new game.
      </p>
      <br />
      <form className="start-game">
        <Input
          id="username"
          name="username"
          value={props.username}
          label="First Name"
          register={register}
          onChange={handleChangeUsername}
        />
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
        {errors.form && <p>{errors.form.message}</p>}
        <button
          className="join lobby-button"
          onClick={(e) => props.handleJoinLobby(e, '')}
          disabled={!usernameIsValid(props.username).valid}
        >
          Join Lobby
        </button>
        <p className="or">- OR -</p>
        <button
          className="host lobby-button"
          onClick={props.handleCreateLobby}
          disabled={!usernameIsValid(props.username).valid}
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
