import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the travel planner', () => {
  render(<App />);
  expect(screen.getByText(/where are you headed/i)).toBeDefined();
  expect(screen.getByText(/review trip/i)).toBeDefined();
});
