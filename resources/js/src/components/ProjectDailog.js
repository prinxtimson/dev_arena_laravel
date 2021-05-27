import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { BASE_URL, axios } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  btn: {
    // position: 'absolute',
    // right: theme.spacing(1),
    // top: theme.spacing(1),
    color: theme.palette.grey[500],
    marginRight: 2
  },
}));

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

const CustomTextField = ({project, handleClick, handleUpdate}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selected, setSelected] = React.useState({});

  const handleFocus = () => {
    if(options.length === 0){
      axios.get(`${BASE_URL}/api/developers`).then(res => {
        setOptions(res.data);
      })
    }
  }

  const handleSave = () => {
    setLoading(true);

    axios.put(`${BASE_URL}/api/assign-dev/${project.id}/${selected.id}`).then(res => {
      //console.log(res.data)
      handleUpdate(res.data)
      setLoading(false);
      handleClick();
    }).catch(err => {
      console.log(err.response);
      setLoading(false);
    })
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={9}>
        <Autocomplete
          //multiple
          id="tags-outlined"
          onFocus={handleFocus}
          options={options}
          getOptionLabel={(option) => option.name}
          onChange={(e, newInput) => setSelected(newInput)}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Developers"
            />
          )}
        />
      </Grid>
      <Grid item xs={3}>
        {loading ? (
          <CircularProgress className={classes.btn} />
        ) : (
          <div style={{display: 'flex'}}>
            <IconButton
              aria-label="submit" 
              className={classes.btn}
              onClick={handleSave}
            >
              <DoneIcon />
            </IconButton>
            <IconButton
              aria-label="close" 
              className={classes.btn}
              onClick={handleClick}>
              <CloseIcon />
            </IconButton>
          </div>
        )}
      </Grid>
    </Grid>
  )
}

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, handleEdit, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="caption">{children}</Typography>
      {onClose ? (
        <>
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
        </>
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

const ProjectDailog = ({isEdit, open, handleClose, handleEdit, project, loading, handleSaveEdit, error, handleUpdate}) => {
  const [editDev, setEditDev] = React.useState(false);
  const classes = useStyles();
  const [data, setData] = React.useState({
    name: project ? project.name : '',
    start: project ? project.start : '',
    end: project ? project.end : '',
    project_pm: project ? project.project_pm : '',
    mandate: project ? project.mandate : '',
  });
  let a = moment(project.end);
  let b = moment();

  const handleSaveChanges = () => {
    handleSaveEdit(data);
  }

  const handleClick = () => {
    setEditDev(false)
  }

  return (
    <>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} handleEdit={handleEdit}>
          Project Details
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
                  id="project_pm"
                  label="Project PM"
                  name="project_pm"
                  autoFocus
                  value={data.project_pm}
                  onChange={e => setData({...data, project_pm: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Project PM"
                  secondary={project.project_pm} />
              )}
            </Grid>
            <Grid item xs={12}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="mandate"
                  label="Project Mandate"
                  name="mandate"
                  autoFocus
                  value={data.mandate}
                  onChange={e => setData({...data, mandate: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Project Mandate"
                  secondary={project.mandate} />
              )}
            </Grid>
            <Grid item xs={12}>
              {isEdit ? null : editDev ? (
                <CustomTextField
                  project={project}
                  handleClick={handleClick}
                  handleUpdate={handleUpdate}
                />
              ) : (
                <ListItemText
                  onClick={() => setEditDev(true)} 
                  primary="Developer"
                  secondary={project.developers.length > 0 && project.developers.map(dev => dev.name).join(', ')} />
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
    </>
  )
}

export default ProjectDailog;
