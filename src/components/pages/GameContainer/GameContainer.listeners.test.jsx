import { act, render } from '@testing-library/react';
import React from 'react';
import io from 'socket.io-client';
import TestWrapper from '../../testing/TestWrapper';
import GameContainer from './GameContainer';

// socket.io-client is mocked in setupTests: io() returns one stand-in socket.
const socket = io();

const listenerCounts = () =>
  socket.on.mock.calls.reduce(
    (counts, [event]) => ({ ...counts, [event]: (counts[event] || 0) + 1 }),
    {},
  );

const serverSends = (event, ...args) => {
  const handlers = socket.on.mock.calls.filter(([e]) => e === event);
  act(() => handlers.forEach(([, handler]) => handler(...args)));
};

const lobby = (players) => ({
  phase: 'LOBBY',
  lobbyCode: '',
  host: 'host',
  players,
  bots: [],
  rounds: [],
  definition: '',
  guesses: [],
  roundId: 0,
  word: '',
  category: '',
  roundSettings: { seconds: 60, source: 'User', filter: {} },
  topThree: [],
  reactions: {},
});

describe('GameContainer socket listeners', () => {
  it('registers each listener once, however often the container re-renders', () => {
    render(
      <TestWrapper>
        <GameContainer />
      </TestWrapper>,
    );
    const atMount = listenerCounts();

    // 'welcome' is registered twice by the component itself (two identical
    // socket.on('welcome') calls); every other event once.
    const { welcome, ...others } = atMount;
    expect(welcome).toBe(2);
    expect(Object.values(others).every((n) => n === 1)).toBe(true);
    expect(Object.keys(others)).toContain('game update');

    // Lobby updates, player list changes, a token and a timer sync re-render
    // the container
    serverSends('welcome', 'me');
    serverSends('player list', [{ id: 'host', username: 'Hosty' }]);
    serverSends('add player', { id: 'me', username: 'Me' });
    serverSends('token update', '');
    serverSends('synchronize', 30);
    serverSends('play again', lobby([{ id: 'host', username: 'Hosty' }]));

    expect(listenerCounts()).toEqual(atMount);
    expect(socket.off).not.toHaveBeenCalled();
  });
});
