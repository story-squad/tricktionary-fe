import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocalStorage } from '../../../hooks';
import { playerIdState } from '../../../state';
import { GuessItem, PlayerItem } from '../../../types/gameTypes';

const SetHost = (props: SetHostProps): React.ReactElement => {
  const playerId = useRecoilValue(playerIdState);
  const [guesses] = useLocalStorage('guesses', []);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chosenPlayer, setChosenPlayer] = useState<string>('');

  const connectedOtherPlayers = () =>
    props.players.filter(
      (player) => player.id !== playerId && player.connected,
    );

  // Update players list on props.players update
  useEffect(() => {
    if (props.players.length > 1) {
      setChosenPlayer(connectedOtherPlayers()[0]?.id);
    }
  }, [props.players]);

  const handleSetChosenPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChosenPlayer(e.target.value);
  };

  const handleOnClick = () => {
    if (connectedOtherPlayers().length > 1) {
      props.handleSetHost(chosenPlayer, guesses as GuessItem[]);
    } else {
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        className={showModal ? 'selected' : ''}
        onClick={() => setShowModal(true)}
      >
        New Host
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Change Hosts</h2>
            {connectedOtherPlayers().length > 1 ? (
              <>
                <p>Click on a name to give them hosting power!</p>
                <select
                  className="players"
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

interface SetHostProps {
  players: PlayerItem[];
  handleSetHost: (hostId: string, guesses: GuessItem[]) => void;
}
