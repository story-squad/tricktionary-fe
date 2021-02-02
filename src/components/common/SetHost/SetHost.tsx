import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { playerIdState } from '../../../state';
import { PlayerItem } from '../../../types/gameTypes';

const SetHost = (props: SetHostProps): React.ReactElement => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chosenPlayer, setChosenPlayer] = useState<string>('0');
  const playerId = useRecoilValue(playerIdState);

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
            <div className="players">
              {props.players
                .filter((player) => player.id === playerId)
                .map((player) => (
                  <button
                    className={player.id === chosenPlayer ? 'selected' : ''}
                    key={player.id}
                    onClick={() => setChosenPlayer(player.id)}
                  >
                    {player.username}
                  </button>
                ))}
            </div>
            <button
              disabled={chosenPlayer === '0'}
              onClick={() => props.handleSetHost(chosenPlayer)}
            >
              Okay
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
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
