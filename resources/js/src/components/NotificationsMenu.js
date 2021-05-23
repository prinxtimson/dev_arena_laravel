import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

const AlertDialog = ({notification, handleDialogClose, open}) => {
  const [loading, setLoading] = React.useState(false);

  const handleAccept = () => {
    const {data} = notification
    setLoading(true);
    axios.put(`${BASE_URL}/api/accept-project`, data)
        .then(res => {
          setLoading(false)
          handleDialogClose()
        })
        .catch(err => {
          console.log(err.response);
          setLoading(false);
       });
  }

  const handleDecline = () => {
    const {data} = notification
    setLoading(true);
    axios.put(`${BASE_URL}/api/decline-project`, data)
        .then(res => {
          setLoading(false)
          handleDialogClose()
        })
        .catch(err => {
          console.log(err.response);
          setLoading(false);
       });
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"New Project Assigned"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Project ${notification && notification.data && notification.data.project} had been assign to you, please accept or decline to take on the project`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDecline} color="primary" disabled={loading}>
            Decline
          </Button>
          <Button onClick={handleAccept} color="primary" disabled={loading} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const NotificationsMenu = ({notifications, anchorE2, handleClose, handleOnFocus}) => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentNotification, setCurrentNotification] = React.useState({})
  
  const handleDialogOpen = (notification) => {
    setCurrentNotification(notification);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const open = Boolean(anchorE2);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
    <AlertDialog
      open={openDialog}
      notification={currentNotification}
      handleDialogClose={handleDialogClose}
    />
    <Popover
      id={id}
      open={open}
      anchorEl={anchorE2}
      onClose={handleClose}
      onFocus={handleOnFocus}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <List component="nav" aria-label="notifications">
        {notifications && notifications.length === 0 ? (
          <ListItem button>
              <ListItemText secondary='No notification yet' />
            </ListItem>
        ) : notifications && notifications.map((notification, index) => {
          if(notification.type === "App\\Notifications\\AssignDev"){
            return (
            <div key={notification.id}>
            <ListItem button onClick={() => handleDialogOpen(notification)}>
              <ListItemText primary="New Project Assign" secondary={`project ${notification && notification.data.project} had been assign to you`} />
            </ListItem>
            {notifications.length-1 < index &&  <Divider />} 
            </div>
            )
          }
          if(notification.type === "App\\Notifications\\AcceptProject"){
            return (
            <div key={notification.id}>
            <ListItem button>
              <ListItemText primary="Project Accepted" secondary={`${notification && notification.data.name} had accepted Project ${notification && notification.data.project}`} />
            </ListItem>
            {notifications.length-1 < index &&  <Divider />} 
            </div>
            )
          }
          if(notification.type === "App\\Notifications\\DeclineProject"){
            return (
            <div key={notification.id}>
            <ListItem button>
              <ListItemText primary="Project Declined" secondary={`${notification && notification.data.name} had declined Project ${notification && notification.data.project}`} />
            </ListItem>
            {notifications.length-1 < index &&  <Divider />} 
            </div>
            )
          }
        })}
      </List>
    </Popover>
    </>
  )
}

export default NotificationsMenu;
