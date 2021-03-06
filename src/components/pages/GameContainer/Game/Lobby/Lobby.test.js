import { render, screen } from '@testing-library/react';
import React from 'react';
import TestWrapper from '../../../../testing/TestWrapper';
import GameContainer from '../../GameContainer';

beforeEach(() => {
  render(
    <TestWrapper>
      <GameContainer />
    </TestWrapper>,
  );
});

describe('Lobby', () => {
  it('renders the Lobby component', () => {
    expect(screen.getByText(/welcome to tricktionary/i)).toBeInTheDocument;
  });
  it('has inputs with default values', () => {
    const nameInput = screen.getByLabelText(/first name/i);
    const codeInput = screen.getByLabelText(/lobby code/i);

    expect(nameInput).toBeInTheDocument;
    expect(codeInput).toBeInTheDocument;

    expect(nameInput).toHaveDisplayValue(/player.*/gi);
    expect(codeInput).toHaveDisplayValue('');
  });
  it('has buttons with default disabled status', () => {
    const joinButton = screen.getByText(/join lobby/i);
    const hostButton = screen.getByText(/host new game/i);

    expect(joinButton).toBeInTheDocument;
    expect(hostButton).toBeInTheDocument;

    expect(joinButton.disabled).toEqual(true);
    expect(hostButton.disabled).toEqual(false);
  });
});
