import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';

import App from './App';

describe('testing the App', () => {
  afterEach(cleanup);

  it('renders a text', () => {
    render(<App />);
    const text = screen.getByRole('heading', { name: /Chat App/i });
    expect(text).toBeTruthy();
  });
});
