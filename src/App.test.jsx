import { expect, test } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

test('adds, updates, and removes a product from the cart', () => {
  render(<App />);

  const productCard = screen.getByText('Wireless Headphones').closest('.product-card');
  fireEvent.click(within(productCard).getByRole('button', { name: 'Add to Cart' }));
  expect(within(productCard).getByText('Added')).toBeDefined();
  expect(within(productCard).getByLabelText('1 in cart')).toBeDefined();

  fireEvent.click(within(productCard).getByRole('button', { name: 'Add one Wireless Headphones' }));
  expect(within(productCard).getByLabelText('2 in cart')).toBeDefined();

  fireEvent.click(within(productCard).getByRole('button', { name: 'Remove one Wireless Headphones' }));
  expect(within(productCard).getByLabelText('1 in cart')).toBeDefined();
  fireEvent.click(within(productCard).getByRole('button', { name: 'Remove one Wireless Headphones' }));
  expect(within(productCard).queryByText('Added')).toBeNull();
  expect(within(productCard).getByRole('button', { name: 'Add to Cart' })).toBeDefined();
});

test('shows the Hyderabad offline stores and their discounts', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Stores' }));

  expect(screen.getByRole('heading', { name: 'ShopHub at Gachibowli' })).toBeDefined();
  expect(screen.getByRole('heading', { name: 'ShopHub at Banjara Hills' })).toBeDefined();
  expect(screen.getByRole('heading', { name: 'ShopHub at HITEX' })).toBeDefined();
  expect(screen.getByText('Up to 15% off select electronics')).toBeDefined();
  expect(screen.getByText('Up to 20% off select home essentials')).toBeDefined();
  expect(screen.getByText('Up to 10% off select accessories')).toBeDefined();
});
