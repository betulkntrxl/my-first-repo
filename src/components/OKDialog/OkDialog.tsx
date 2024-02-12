import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const OKDialog = (props: {
  handleClose: () => void;
  openDialog: boolean;
  headerText: string;
  bodyText: string;
}) => {
  const { t } = useTranslation();

  const { handleClose, openDialog, headerText, bodyText } = props;

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={openDialog}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <Typography color="red" fontWeight="bold">
          {headerText} !
        </Typography>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom sx={{ whiteSpace: 'pre-line' }}>
          {bodyText}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} title="close-button">
          {t('buttons.ok')}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default OKDialog;
