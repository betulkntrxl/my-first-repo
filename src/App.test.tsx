import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';

import App from './App';

describe('testing the App', () => {
  afterEach(cleanup);

  it('renders a menu', () => {
    render(<App />);
    const menu = screen.getByLabelText('menu');
    expect(menu).toBeTruthy();
  });

  it('renders a Temperature slider', () => {
    render(<App />);
    const temperature = screen.getByLabelText('Temperature');
    expect(temperature).toBeTruthy();
  });
  it('renders a Top P slider', () => {
    render(<App />);
    const topP = screen.getByLabelText('Top P');
    expect(topP).toBeTruthy();
  });
  it('renders a Max Tokens slider', () => {
    render(<App />);
    const maxTokens = screen.getByLabelText('Max Tokens');
    expect(maxTokens).toBeTruthy();
  });
});
