import { act, fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { vi } from 'vitest';
import { lobbyState, playerIdState } from '../../../../../state/gameState';
import { LobbyData, PlayerItem } from '../../../../../types/gameTypes';
import Writing from './Writing';

const player = (id: string, definition = ''): PlayerItem => ({
  id,
  pid: id,
  username: id,
  definition,
  definitionId: undefined,
  points: 0,
  connected: true,
  playerPlacing: 0,
});

const seed =
  (me: PlayerItem, seconds: number) =>
  ({ set }: MutableSnapshot) => {
    set(lobbyState, (lobby: LobbyData) => ({
      ...lobby,
      phase: 'WRITING',
      host: 'host',
      word: 'jollop',
      players: [player('host'), me],
      roundSettings: { ...lobby.roundSettings, seconds },
    }));
    set(playerIdState, me.id);
  };

// Holds the timer like GameContainer and passes new callbacks on every render.
const Harness = (props: { submit: (definition: string) => void }) => {
  const [time, setTime] = useState(-1);
  return (
    <Writing
      handleSubmitDefinition={(d) => props.submit(d)}
      handleBotSubmitDefinition={() => undefined}
      handleSetPhase={() => undefined}
      handleSyncTimer={() => undefined}
      time={time}
      setTime={setTime}
    />
  );
};

// One act per second, so each tick renders (act batches the updates inside it)
const advanceSeconds = (seconds: number) => {
  for (let i = 0; i < seconds; i++) {
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  }
};

describe('Writing', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('auto-submits the typed definition once, when the timer runs out', () => {
    const submit = vi.fn();
    const { rerender } = render(
      <RecoilRoot initializeState={seed(player('p1'), 3)}>
        <Harness submit={submit} />
      </RecoilRoot>,
    );

    const box = screen.getByLabelText(/your best definition/i);
    fireEvent.change(box, { target: { value: 'a sort' } });
    fireEvent.change(box, { target: { value: 'a sort of stew' } });
    expect(submit).not.toHaveBeenCalled();

    advanceSeconds(4);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith('a sort of stew');

    // New callbacks from the parent after time is up do not submit again
    rerender(
      <RecoilRoot initializeState={seed(player('p1'), 3)}>
        <Harness submit={submit} />
      </RecoilRoot>,
    );
    advanceSeconds(2);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('restores a rejoining player’s submission on mount', () => {
    render(
      <RecoilRoot initializeState={seed(player('p1', 'already sent'), 0)}>
        <Harness submit={vi.fn()} />
      </RecoilRoot>,
    );
    expect(screen.getByText(/you submitted/i)).toBeInTheDocument();
    expect(screen.getByText('already sent')).toBeInTheDocument();
  });
});
