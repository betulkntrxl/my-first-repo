import * as React from 'react';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSignal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';

export default function SnackbarComponent({ showStatus }: any) {
  const setOpen = useSignal<boolean>(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    setOpen.value = showStatus;
  }, [showStatus]);

  return (
    <div>
      <Snackbar
        open={setOpen.value}
        autoHideDuration={2000}
        data-testid="copy-snackbar"
        message={t('copy-alert')}
      />
    </div>
  );
}
