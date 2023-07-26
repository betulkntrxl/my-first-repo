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

const APIErrorDialog = (props: { handleAPITimeoutClose: () => void; openAPITimeout: boolean }) => {
  const { handleAPITimeoutClose, openAPITimeout } = props;

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
      onClose={handleAPITimeoutClose}
      aria-labelledby="customized-dialog-title"
      open={openAPITimeout}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleAPITimeoutClose}>
        <div style={{ color: 'red', fontWeight: 'bold' }}>API Timeout</div>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Is your question complex? If so the API could take a bit more time to respond.
          <br />
          You can increase the API Timeout in the Configuration Menu.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleAPITimeoutClose}>
          Ok
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default APIErrorDialog;
