import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';

import App from './App';

describe('testing the App', () => {
  afterEach(cleanup);

  it('renders a text', () => {
    render(<App />);
    const text = screen.getByRole('heading', { name: /Hello OpenAI/i });
    expect(text).toBeTruthy();
  });
});
