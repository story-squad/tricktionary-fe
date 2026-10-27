import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import io from 'socket.io-client';
import TestWrapper from '../../testing/TestWrapper';
import GameContainer from './GameContainer';

// socket.io-client is mocked in setupTests: io() returns one stand-in socket.
const socket = io();

const renderApp = () =>
  render(
    <TestWrapper>
      <GameContainer />
    </TestWrapper>,
  );

const nameField = () => screen.getByLabelText(/first name/i);

beforeEach(() => {
  socket.on.mockClear();
  socket.emit.mockClear();
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

describe("The player's name", () => {
  it('survives a reload after joining a lobby', () => {
    const { unmount } = renderApp();
    fireEvent.change(nameField(), { target: { value: ' Alice ' } });
    fireEvent.change(screen.getByLabelText(/lobby code/i), {
      target: { value: 'ABCD' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Join Lobby' }));
    expect(socket.emit).toHaveBeenCalledWith('join lobby', 'Alice', 'ABCD');
    expect(localStorage.getItem('username')).toBe(JSON.stringify('Alice'));

    // Reload
    unmount();
    renderApp();

    expect(nameField()).toHaveValue('Alice');
  });

  it('keeps a name an older build saved without JSON encoding', () => {
    localStorage.setItem('username', 'Alice');
    renderApp();
    expect(nameField()).toHaveValue('Alice');
  });
});
