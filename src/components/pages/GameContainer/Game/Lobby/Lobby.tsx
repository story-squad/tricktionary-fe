import gsap from 'gsap';
import jwt from 'jsonwebtoken';
import React, { SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import alphabotA from '../../../../../assets/alphabot-a.png';
import alphabotZ from '../../../../../assets/alphabot-z.png';
import { useLocalStorage } from '../../../../../hooks';
import {
  allowUrlJoinState,
  loadingState,
} from '../../../../../state/gameState';
import { DecodedToken } from '../../../../../types/commonTypes';
import { MAX_USERNAME_LENGTH } from '../../../../../utils/constants';
import { initialToken } from '../../../../../utils/localStorageInitialValues';
import {
  lobbyCodeIsValid,
  usernameIsValid,
} from '../../../../../utils/validation';
import {
  CharCounter,
  Input,
  Modal,
  ProTip,
  PublicGames,
} from '../../../../common';
import { HowToPlay } from '../../../../common/HowTo';

const Lobby = (props: LobbyProps): React.ReactElement => {
  const location = useLocation();
  const [token] = useLocalStorage<string>('token', initialToken);
  const [loading, setLoading] = useRecoilState(loadingState);
  const allowUrlJoin = useRecoilValue(allowUrlJoinState);
  const [joinModal, setJoinModal] = useState(false);
  const [reJoinModal, setReJoinModal] = useState(false);

  //set up the form details
  const { register, errors, setError, clearErrors } = useForm({
    mode: 'onSubmit',
  });

  // Either "login" player if we have a code, or just reset game data
  useEffect(() => {
    const lobbyUrl = location.pathname;
    console.log('opened tabs', props.openTabs);

    if (lobbyUrl !== '/') {
      console.log('Lobby.tsx - Line 49 - Player Entered Game');

      props.setLobbyCode(lobbyUrl.substring(1, 5));

      if (token === undefined || token === '') {
        setJoinModal(true);
      } else {
        if (Number(props.openTabs) < 1) {
          setReJoinModal(true);
        }
      }
    } else {
      console.log('Lobby.tsx - Line 44 - Resetting Game');

      props.resetGame();
    }
  }, [location.pathname]);

  // Join a game if the lobbyCode is provided in the URL
  useEffect(() => {
    if (allowUrlJoin) {
      const decodedToken: DecodedToken = jwt.decode(token) as DecodedToken;
      let lobbyUrl = location.pathname;

      if (lobbyUrl !== '/') {
        lobbyUrl = lobbyUrl.substring(1, 5);
      }

      // If the user is entering a new game, join. Else, let the login event handle joining
      if (lobbyUrl !== decodedToken?.lob) {
        props.handleJoinLobby(null, lobbyUrl);
      }
    }
  }, [allowUrlJoin]);

  // Adding some effects to bots
  useEffect(() => {
    gsap.to('#alphabot-z', {
      duration: 3,
      y: -20,
      repeat: -1,
      yoyo: true,
      delay: 0.5,
    });
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

  const handleJoinByClick = (e: React.MouseEvent) => {
    setLoading('loading');
    props.handleJoinLobby(e, '');
  };

  const joinGameModal = (
    <form className="start-game modal-join-form">
      <div className="char-counter-wrapper">
        <Input
          id="username"
          name="username"
          value={props.username}
          label="Codename"
          register={register}
          onChange={handleChangeUsername}
          maxLength={MAX_USERNAME_LENGTH}
        />
        <CharCounter string={props.username} max={MAX_USERNAME_LENGTH} />
      </div>
      <input
        id="lobby-code"
        name="lobby-code"
        value={props.lobbyCode}
        type="hidden"
      />
      {errors.form && <p className="error">*{errors.form.message}</p>}
      <div className="start-buttons">
        <button
          className="no-bottom-margin"
          onClick={handleJoinByClick}
          disabled={
            !usernameIsValid(props.username).valid ||
            props.lobbyCode.length !== 4 ||
            loading === 'loading'
          }
        >
          Join
        </button>

        <button
          onClick={() => {
            setJoinModal(false);
            props.resetGame();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <>
      <Modal
        header={`Join Lobby ${props.lobbyCode}!`}
        customJSXCode={joinGameModal}
        message={''}
        customConfirmText="Join"
        visible={joinModal}
      />

      <Modal
        header={'HEY!'}
        message={
          'Seems like you disconnected from a game. Would you like to re-join the game?'
        }
        handleConfirm={() => props.handleLogin()}
        handleCancel={() => {
          setReJoinModal(false);
          props.resetGame();
        }}
        visible={reJoinModal}
      />

      <PublicGames />
      <div className="lobby game-page">
        <ProTip />
        <HowToPlay />

        <div className="bots">
          <div className="bots-inner">
            <img src={alphabotA} alt="Alphabot A" id="alphabot-a" />
            <img src={alphabotZ} alt="Alphabot Z" id="alphabot-z" />
          </div>
        </div>
        <section>
          <h1>Welcome to Word Hoax!</h1>
          <p className="instructions bot-margin">
            Please enter your name and lobby code to join a game or you can host
            a new game.
          </p>
          <form className="start-game">
            <div className="char-counter-wrapper">
              <Input
                id="username"
                name="username"
                value={props.username}
                label="First Name"
                register={register}
                onChange={handleChangeUsername}
                maxLength={MAX_USERNAME_LENGTH}
              />
              <CharCounter string={props.username} max={MAX_USERNAME_LENGTH} />
            </div>
            <label htmlFor="lobby-code">Lobby Code</label>
            <input
              id="lobby-code"
              name="lobby-code"
              value={props.lobbyCode}
              onChange={handleChangeCode}
              maxLength={4}
              placeholder="Enter lobby code to join a game!"
            />
            {errors.form && <p className="error">*{errors.form.message}</p>}
            <div className="start-buttons">
              <button
                className="no-bottom-margin"
                onClick={handleJoinByClick}
                disabled={
                  !usernameIsValid(props.username).valid ||
                  props.lobbyCode.length !== 4 ||
                  loading === 'loading'
                }
              >
                Join Lobby
              </button>
              <p className="or">Or</p>
              <button
                className="secondary no-bottom-margin"
                onClick={props.handleCreateLobby}
                disabled={
                  !usernameIsValid(props.username).valid ||
                  loading === 'loading'
                }
              >
                Host New Game
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
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
  handleLogin: any;
  resetGame: any;
  openTabs: string;
}
