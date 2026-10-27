import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import io from 'socket.io-client';
import TestWrapper from '../../testing/TestWrapper';
import GameContainer from './GameContainer';

// socket.io-client is mocked in setupTests: io() returns one stand-in socket.
const socket = io();

// The URL after every change the history makes
let paths = [];
const recordPaths = () => {
  const { pushState } = window.history;
  window.history.pushState = function (...args) {
    pushState.apply(this, args);
    paths.push(window.location.pathname);
  };
  return () => {
    window.history.pushState = pushState;
  };
};

const serverSends = (event, ...args) => {
  const handlers = socket.on.mock.calls.filter(([e]) => e === event);
  act(() => handlers.forEach(([, handler]) => handler(...args)));
};

const joinsSent = () =>
  socket.emit.mock.calls
    .filter(([event]) => event === 'join lobby')
    .map(([, , code]) => code);

// The server answers a join for '/' (no lobby code) with error 2000
const answerJoinsForHome = () =>
  joinsSent()
    .filter((code) => code === '/')
    .forEach(() =>
      serverSends(
        'error',
        2000,
        'The lobby code you entered is not long enough',
      ),
    );

// A token as the server issues it; the app only decodes the payload.
const tokenFor = (lob) => {
  const part = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  return `${part({ alg: 'HS256', typ: 'JWT' })}.${part({
    sub: 'me',
    pid: 'player-1',
    lob,
    iat: 1,
    exp: 9999999999,
  })}.signature`;
};

const lobby = (lobbyCode, host) => ({
  phase: 'PREGAME',
  lobbyCode,
  host,
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

let restorePaths;
beforeEach(() => {
  socket.on.mockClear();
  socket.emit.mockClear();
  localStorage.clear();
  window.history.pushState({}, '', '/');
  render(
    <TestWrapper>
      <GameContainer />
    </TestWrapper>,
  );
  paths = [];
  restorePaths = recordPaths();
});

afterEach(() => restorePaths());

describe('The URL after creating or joining a lobby', () => {
  it('stays /CODE after creating one', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Host New Game' }));
    // The server answers 'login' with a token and 'create lobby' with the game
    serverSends('welcome', 'me');
    serverSends('token update', tokenFor(''));
    serverSends('game update', lobby('ABCD', 'me'));
    serverSends('token update', tokenFor('ABCD'));
    answerJoinsForHome();

    expect(joinsSent()).toEqual([]);
    expect(paths).toEqual(['/ABCD']);
    expect(window.location.pathname).toBe('/ABCD');
  });

  it('stays /CODE after joining one by code', () => {
    fireEvent.change(screen.getByLabelText(/lobby code/i), {
      target: { value: 'ABCD' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Join Lobby' }));
    // A new player's join brings a token update before the game
    serverSends('welcome', 'me');
    serverSends('token update', tokenFor(''));
    serverSends('game update', lobby('ABCD', 'host'));
    serverSends('token update', tokenFor('ABCD'));
    answerJoinsForHome();

    expect(joinsSent()).toEqual(['ABCD']);
    expect(paths).toEqual(['/ABCD']);
    expect(window.location.pathname).toBe('/ABCD');
  });
});
