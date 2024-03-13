import * as React from 'react';
import { render, screen, within } from '@testing-library/react';

import { useTranslation } from 'react-i18next';
import SnackbarComponent from '../components/SnackBar/SnackBar';

describe('MuiSnackbar Tests', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render snackbar when button is clicked', async () => {
    const { t } = useTranslation();
    render(<SnackbarComponent showStatus />);

    const snackbar = within(await screen.findByRole('alert'));
    expect(snackbar.getByText(t('copy-alert'))).toBeInTheDocument();
  });
});
