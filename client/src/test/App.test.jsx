import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store/index.js';
import { App } from '../app/App.jsx';

const renderWithProviders = (initialRoute = '/') => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe('Client Foundation & Route System', () => {
  test('renders landing page with headline and navigation', () => {
    renderWithProviders('/');
    expect(screen.getAllByText(/ParkSphere/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Reserve Your Parking Spot in/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter city/i)).toBeInTheDocument();
  });

  test('redirects unauthenticated customer route to login', () => {
    renderWithProviders('/customer/dashboard');
    expect(screen.getByText(/Sign In to ParkSphere/i)).toBeInTheDocument();
  });

  test('redirects unauthenticated operator route to login', () => {
    renderWithProviders('/operator/dashboard');
    expect(screen.getByText(/Sign In to ParkSphere/i)).toBeInTheDocument();
  });

  test('renders 404 page for unknown paths', () => {
    renderWithProviders('/unknown-arbitrary-path');
    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
  });
});
