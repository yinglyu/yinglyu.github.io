import React from 'react';
import { render, screen } from '@testing-library/react';
import { Game } from './Game';

test('renders the catch douzhi game title and score label', () => {
  render(<Game />);

  expect(screen.getByText(/catch douzhi/i)).toBeInTheDocument();
  expect(screen.getByText(/score/i)).toBeInTheDocument();
});
