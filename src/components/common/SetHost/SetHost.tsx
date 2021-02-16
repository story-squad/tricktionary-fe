import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { playerIdState } from '../../../state';
import { PlayerItem } from '../../../types/gameTypes';

const SetHost = (props: SetHostProps): React.ReactElement => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const playerId = useRecoilValue(playerIdState);
  const [players] = useState(
    props.players.filter((player) => player.id !== playerId),
  );
  const [chosenPlayer, setChosenPlayer] = useState<string>(players[0].id);

  const handleSetChosenPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    console.log(chosenPlayer);
    setChosenPlayer(e.target.value);
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
            <p>Click on a name to give them hosting power!</p>
            <select
              className="players"
              name="players-select"
              id="players-select"
              onChange={(e) => console.log(e.target.value)}
            >
              {players.map((player, key) => (
                <option key={key} value={player.id}>
                  {player.username}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button
                disabled={chosenPlayer === '0'}
                onClick={() => props.handleSetHost(chosenPlayer)}
              >
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
  handleSetHost: (hostId: string) => void;
}
