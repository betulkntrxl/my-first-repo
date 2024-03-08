import * as React from 'react';

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSignal } from '@preact/signals-react';
import { useTranslation } from 'react-i18next';

export default function SimpleSnackbar({ showStatus }: any) {
  const setOpen = useSignal<boolean>(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    setOpen.value = showStatus;
  }, [showStatus]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen.value = false;
  };

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <div>
      <Snackbar
        open={setOpen.value}
        autoHideDuration={2000}
        onClose={handleClose}
        message={t('Content copied to clipboard')}
        action={action}
      />
    </div>
  );
}
