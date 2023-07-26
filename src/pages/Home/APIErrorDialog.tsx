import React from 'react';
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

function BootstrapDialogTitle(props: DialogTitleProps) {
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
}

const APIErrorDialog = (props: { handleAPIErrorClose: () => void; openAPIError: boolean }) => {
  const { handleAPIErrorClose, openAPIError } = props;

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
      onClose={handleAPIErrorClose}
      aria-labelledby="customized-dialog-title"
      open={openAPIError}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleAPIErrorClose}>
        <div style={{ color: 'red', fontWeight: 'bold' }}>Error !</div>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          An error has occured. Please try again at a later time.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleAPIErrorClose} title="close-button">
          Ok
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default APIErrorDialog;
