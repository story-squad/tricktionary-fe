import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import io from 'socket.io-client';
import TestWrapper from '../../testing/TestWrapper';
import GameContainer from './GameContainer';

// socket.io-client is mocked in setupTests: io() returns one stand-in socket.
const socket = io();

const NOT_ACTIVE =
  'The lobby code you entered does not correspond to an active room';
const TOO_SHORT = 'The lobby code you entered is not long enough';
const message = (code) =>
  `The lobby with code ${code} doesn't exist or has ended.`;

const serverSends = (event, ...args) => {
  const handlers = socket.on.mock.calls.filter(([e]) => e === event);
  act(() => handlers.forEach(([, handler]) => handler(...args)));
};

const joinsSent = () =>
  socket.emit.mock.calls
    .filter(([event]) => event === 'join lobby')
    .map(([, , code]) => code);

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

const renderAt = (path) => {
  window.history.pushState({}, '', path);
  render(
    <TestWrapper>
      <GameContainer />
    </TestWrapper>,
  );
};

beforeEach(() => {
  socket.on.mockClear();
  socket.emit.mockClear();
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

describe('Joining a lobby that does not exist', () => {
  it('typed code + Join: goes home and shows the message', () => {
    renderAt('/');
    fireEvent.change(screen.getByLabelText(/lobby code/i), {
      target: { value: 'zzzz' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Join Lobby' }));
    expect(joinsSent()).toEqual(['ZZZZ']);

    serverSends('error', 2000, NOT_ACTIVE);

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText(message('ZZZZ'))).toBeInTheDocument();
  });

  it('invite link + Join: goes home and shows the message', () => {
    renderAt('/ABCD');
    // No saved token, so the invite asks for a name and a click on Join
    fireEvent.click(screen.getByRole('button', { name: 'Join' }));
    expect(joinsSent()).toEqual(['ABCD']);

    serverSends('error', 2000, NOT_ACTIVE);

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText(message('ABCD'))).toBeInTheDocument();
    // The invite's dialog is closed: the player is on the home screen
    expect(screen.queryByRole('heading', { name: /join lobby/i })).toBeNull();
    expect(screen.queryByText(/would you like to re-join/i)).toBeNull();
  });

  it('invite link while holding a token from another game: shows the message', () => {
    localStorage.setItem('token', JSON.stringify(tokenFor('EFGH')));
    localStorage.setItem('openTabs', JSON.stringify(0));
    renderAt('/ABCD');
    fireEvent.click(screen.getByRole('button', { name: 'Okay' }));
    serverSends('token update', tokenFor(''));
    expect(joinsSent()).toEqual(['ABCD']);

    serverSends('error', 2000, NOT_ACTIVE);

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText(message('ABCD'))).toBeInTheDocument();
    // The invite's dialog is closed: the player is on the home screen
    expect(screen.queryByRole('heading', { name: /join lobby/i })).toBeNull();
    expect(screen.queryByText(/would you like to re-join/i)).toBeNull();
  });

  it('invite link while the last game is still running: shows the message', () => {
    localStorage.setItem('token', JSON.stringify(tokenFor('EFGH')));
    localStorage.setItem('openTabs', JSON.stringify(0));
    renderAt('/ABCD');
    fireEvent.click(screen.getByRole('button', { name: 'Okay' }));
    serverSends('token update', tokenFor(''));
    expect(joinsSent()).toEqual(['ABCD']);
    // The server puts the returning player back into EFGH before it answers
    // the join for ABCD
    serverSends('game update', lobby('EFGH'));

    serverSends('error', 2000, NOT_ACTIVE);

    expect(screen.getByText(message('ABCD'))).toBeInTheDocument();
  });

  it('returning player whose saved lobby has closed: goes home, no message', () => {
    localStorage.setItem('token', JSON.stringify(tokenFor('ABCD')));
    localStorage.setItem('openTabs', JSON.stringify(0));
    renderAt('/ABCD');
    fireEvent.click(screen.getByRole('button', { name: 'Okay' }));
    // The reconnect goes through 'login'; the app sends no join of its own
    expect(socket.emit).toHaveBeenCalledWith(
      'login',
      tokenFor('ABCD'),
      expect.any(String),
    );
    serverSends('token update', tokenFor(''));
    expect(joinsSent()).toEqual([]);

    serverSends('error', 2000, NOT_ACTIVE);

    expect(window.location.pathname).toBe('/');
    expect(screen.queryByText(/would you like to re-join/i)).toBeNull();
    expect(screen.queryByText(/doesn't exist or has ended/)).toBeNull();
    expect(screen.queryByText(NOT_ACTIVE)).toBeNull();
  });

  it("the app's own join after a successful one stays silent", () => {
    renderAt('/');
    fireEvent.change(screen.getByLabelText(/lobby code/i), {
      target: { value: 'WXYZ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Join Lobby' }));
    // A new player's join brings a token update, which sends a second join
    // for the URL ('/') on its own
    serverSends('token update', tokenFor(''));
    expect(joinsSent()).toEqual(['WXYZ', '/']);
    serverSends('game update', lobby('WXYZ'));

    serverSends('error', 2000, TOO_SHORT);

    expect(screen.queryByText(/doesn't exist or has ended/)).toBeNull();
    expect(screen.queryByText(TOO_SHORT)).toBeNull();
  });
});
