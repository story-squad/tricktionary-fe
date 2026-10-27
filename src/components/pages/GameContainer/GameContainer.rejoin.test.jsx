import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import io from 'socket.io-client';
import TestWrapper from '../../testing/TestWrapper';
import GameContainer from './GameContainer';

// socket.io-client is mocked in setupTests: io() returns one stand-in socket.
const socket = io();

const NOT_ACTIVE =
  'The lobby code you entered does not correspond to an active room';
const REJOIN = /would you like to re-join/i;

const serverSends = (event, ...args) => {
  const handlers = socket.on.mock.calls.filter(([e]) => e === event);
  act(() => handlers.forEach(([, handler]) => handler(...args)));
};

// A token as the server issues it; the app only decodes the payload.
const tokenFor = (lob) => {
  const part = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  return `${part({ alg: 'HS256', typ: 'JWT' })}.${part({
    sub: 'old-socket',
    pid: 'player-1',
    lob,
    iat: 1,
    exp: 9999999999,
  })}.signature`;
};

const lobby = (lobbyCode) => ({
  phase: 'PREGAME',
  lobbyCode,
  host: 'host',
  players: [
    { id: 'host', username: 'Hosty' },
    { id: 'me', username: 'Me' },
  ],
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

// A reload at /ABCD: the saved token is for ABCD and the closed tab brought
// the tab count to 0, so the re-join dialog opens
const reloadInLobby = () => {
  localStorage.setItem('token', JSON.stringify(tokenFor('ABCD')));
  localStorage.setItem('openTabs', JSON.stringify(0));
  window.history.pushState({}, '', '/ABCD');
  render(
    <TestWrapper>
      <GameContainer />
    </TestWrapper>,
  );
  expect(screen.getByText(REJOIN)).toBeInTheDocument();
};

beforeEach(() => {
  socket.on.mockClear();
  socket.emit.mockClear();
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

describe('Re-join dialog after a reload', () => {
  it('Okay sends the re-join and closes the dialog before the server answers', () => {
    reloadInLobby();
    fireEvent.click(screen.getByRole('button', { name: 'Okay' }));

    expect(socket.emit).toHaveBeenCalledWith(
      'login',
      tokenFor('ABCD'),
      expect.any(String),
    );
    expect(screen.queryByText(REJOIN)).toBeNull();
  });

  it('Okay, lobby still running: the player is back in the game', () => {
    reloadInLobby();
    fireEvent.click(screen.getByRole('button', { name: 'Okay' }));
    serverSends('welcome', 'me');
    serverSends('token update', tokenFor('ABCD'));
    serverSends('game update', lobby('ABCD'));

    expect(window.location.pathname).toBe('/ABCD');
    expect(screen.queryByText(REJOIN)).toBeNull();
    expect(screen.queryByText(/welcome to word hoax/i)).toBeNull();
  });

  it.each([['The lobby with code ABCD has ended'], [NOT_ACTIVE]])(
    'Okay, lobby deleted: the server answers 2000 (%s) and the player goes home',
    (text) => {
      reloadInLobby();
      fireEvent.click(screen.getByRole('button', { name: 'Okay' }));
      serverSends('token update', tokenFor('ABCD'));
      serverSends('error', 2000, text);

      expect(window.location.pathname).toBe('/');
      expect(screen.queryByText(REJOIN)).toBeNull();
      expect(screen.getByText(/welcome to word hoax/i)).toBeInTheDocument();
      expect(screen.queryByText(/doesn't exist or has ended/)).toBeNull();
      expect(screen.queryByText(text)).toBeNull();
    },
  );

  it('Cancel goes home', () => {
    reloadInLobby();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(window.location.pathname).toBe('/');
    expect(screen.queryByText(REJOIN)).toBeNull();
  });
});
