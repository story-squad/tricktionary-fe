import React, { useState } from 'react';
import { PlayerItem } from '../../../types/gameTypes';

const SetHost = (props: SetHostProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chosenPlayer, setChosenPlayer] = useState<string>('0');

  return (
    <>
      <button onClick={() => setShowModal(true)}>New Host</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {props.players.map((player) => (
              <button
                key={player.id}
                onClick={() => setChosenPlayer(player.id)}
              >
                {player.username}
              </button>
            ))}
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
