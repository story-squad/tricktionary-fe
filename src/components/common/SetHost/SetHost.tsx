import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocalStorage } from '../../../hooks';
import { handleSetHostFn } from '../../../state/functionState';
import {
  loadingState,
  lobbyState,
  playerIdState,
} from '../../../state/gameState';
import { GuessItem } from '../../../types/gameTypes';
import { initialGuesses } from '../../../utils/localStorageInitialValues';

const SetHost = (): React.ReactElement => {
  const playerId = useRecoilValue(playerIdState);
  const loading = useRecoilValue(loadingState);
  const lobbyData = useRecoilValue(lobbyState);
  const handleSetHost = useRecoilValue(handleSetHostFn);
  const [guesses] = useLocalStorage('guesses', initialGuesses);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chosenPlayer, setChosenPlayer] = useState<string>('');

  const connectedOtherPlayers = () =>
    lobbyData.players.filter(
      (player) => player.id !== playerId && player.connected,
    );

  // Update players list on lobbyData.players update
  useEffect(() => {
    if (lobbyData.players.length >= 1) {
      setChosenPlayer(connectedOtherPlayers()[0]?.id);
    }
  }, [lobbyData.players]);

  const handleSetChosenPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChosenPlayer(e.target.value);
  };

  const handleOnClick = () => {
    if (connectedOtherPlayers().length >= 1) {
      handleSetHost(chosenPlayer, lobbyData.lobbyCode, guesses as GuessItem[]);
    } else {
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        className="no-bottom-margin secondary"
        onClick={() => setShowModal(true)}
        disabled={loading === 'loading'}
      >
        New Host
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Hosts</h2>
            {connectedOtherPlayers().length >= 1 ? (
              <>
                <p>Click on a name to give them hosting power!</p>
                <select
                  className="host-dropdown"
                  name="players-select"
                  id="players-select"
                  onChange={handleSetChosenPlayer}
                >
                  {connectedOtherPlayers().map((player, key) => (
                    <option key={key} value={player.id}>
                      {player.username}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <p>There are currently no other players in the game.</p>
            )}
            <div className="modal-buttons">
              <button disabled={chosenPlayer === '0'} onClick={handleOnClick}>
                Okay
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SetHost;
