import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  editText: {
    position: 'absolute',
    right: theme.spacing(5),
    top: theme.spacing(2),
    color: theme.palette.grey[500],
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, handleEdit, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="caption">{children}</Typography>
      {onClose ? (
        <div>
          <Button
            type="submit"
            variant="text"
            color="primary"
            size="small"
            onClick={handleEdit}
            className={classes.editText}
          >
            Edit
          </Button>        
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const ProjectDailog = ({isEdit, open, handleClose, handleEdit}) => {
  console.log(isEdit)
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} handleEdit={handleEdit}>
          Modal title
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoFocus
                  //value={data.firstname}
                  //onChange={e => setData({...data, firstname: e.target.value})}
                />
              ) : (
                <ListItemText primary="Name" secondary="project" />
              )}
            </Grid>
            <Grid item xs={12}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="name"
                  label="Developer"
                  name="developer"
                  autoFocus
                  //value={data.firstname}
                  //onChange={e => setData({...data, firstname: e.target.value})}
                />
              ) : (
                <ListItemText primary="Developer" secondary="project" />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="start_date"
                  label="Start Date"
                  name="start_date"
                  autoFocus
                  //value={data.firstname}
                  //onChange={e => setData({...data, firstname: e.target.value})}
                />
              ) : (
                <ListItemText primary="Start" secondary="project" />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="end_date"
                  label="End Date"
                  name="end_date"
                  autoFocus
                  //value={data.firstname}
                  //onChange={e => setData({...data, firstname: e.target.value})}
                />
              ) : (
                <ListItemText primary="End" secondary="project" />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        {isEdit ? (
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Save changes
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </div>
  )
}

export default ProjectDailog;
