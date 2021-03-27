import { render } from '@testing-library/react';
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
});
