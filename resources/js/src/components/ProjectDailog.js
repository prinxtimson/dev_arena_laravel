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
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';

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

const ProjectDailog = ({isEdit, open, handleClose, handleEdit, project, loading, handleSaveEdit, error}) => {
  const [data, setData] = React.useState({
    name: project ? project.name : '',
    start: project ? project.start : '',
    end: project ? project.end : '',
  });
  let a = moment(project.end);
  let b = moment.now();

  const handleSaveChanges = () => {
    handleSaveEdit(data);
  }

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} handleEdit={handleEdit}>
          Modal title
        </DialogTitle>
        <DialogContent>
          {!isEdit && (
          <ListItemText
          primary="Status"
          secondary={a.diff(b) <= 0 ? 'Completed' : 'In progress'}/>
          )}
          {error ? (
            <Alert onClose={() => setError(null)} severity="error">
                {error.message}
            </Alert>
            ) : null}
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
                  value={data.name}
                  onChange={e => setData({...data, name: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Name"
                  secondary={project.name} />
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
                  value={data.name}
                  onChange={e => setData({...data, name: e.target.value})}
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
                  type=""
                  autoFocus
                  defaultValue={moment(data.start).format('L')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => setData({...data, start: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Start"
                  secondary={moment(project.start).format('MMM Do YYYY')} 
                />
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
                  type="date"
                  autoFocus
                  defaultValue={moment(data.end).format('L')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => setData({...data, end: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="End"
                  secondary={moment(project.end).format('MMM Do YYYY')}/>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        {isEdit ? (
          <DialogActions>
            <Button
              onClick={handleSaveChanges}
              color="primary"
              disabled={loading}>
              Save changes
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </div>
  )
}

export default ProjectDailog;
