import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import App from '../App';

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('App', () => {
  it('renders the navbar with LocalStore branding', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Local')).toBeInTheDocument();
    expect(screen.getByText('Store')).toBeInTheDocument();
  });

  it('renders the products link', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('renders sign in button when not authenticated', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
