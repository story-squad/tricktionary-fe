import { render, screen } from '@testing-library/react';
import React from 'react';
import TestWrapper from '../../testing/TestWrapper';
import GameContainer from './GameContainer';

describe('GameContainer', () => {
  it('renders the GameContainer component', () => {
    render(
      <TestWrapper>
        <GameContainer />
      </TestWrapper>,
    );
  });
  it('renders the Lobby component/page by default', () => {
    render(
      <TestWrapper>
        <GameContainer />
      </TestWrapper>,
    );

    expect(screen.getByText(/Welcome to Tricktionary/)).toBeInTheDocument;
  });
});
