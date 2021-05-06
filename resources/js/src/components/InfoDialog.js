import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useLocation} from "react-router-dom";

const InfoDialog = ({email_verified_at}) => {
  const [open, setOpen] = React.useState(!Boolean(email_verified_at));
  const location = useLocation();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open && location.pathname !== "/dashboard/change_password"}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            Secure Your Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are requried to change your password to your prefer and secure password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleClose}
            color="primary"
            href="/dashboard/change_password"
            autoFocus
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InfoDialog;
