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

const SessionExpiredDialog = (props: {
  handleSessionExpiredClose: () => void;
  openSessionExpired: boolean;
  handleSessionExpiredContinue: () => void;
}) => {
  const { handleSessionExpiredClose, openSessionExpired, handleSessionExpiredContinue } = props;

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
      onClose={handleSessionExpiredClose}
      aria-labelledby="customized-dialog-title"
      open={openSessionExpired}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleSessionExpiredClose}>
        <div style={{ color: 'steelblue', fontWeight: 'bold', fontFamily: 'arial' }}>
          Session Expired
        </div>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>Your session has expired. Do you want to continue?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleSessionExpiredClose}>
          Cancel
        </Button>
        <Button variant="contained" autoFocus onClick={handleSessionExpiredContinue}>
          Continue
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default SessionExpiredDialog;
