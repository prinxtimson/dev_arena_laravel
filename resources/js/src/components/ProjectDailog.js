import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FileIcon, defaultStyles } from 'react-file-icon';
import Chip from '@material-ui/core/Chip';
import { UserContext } from '../context/GlobalState';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { BASE_URL, axios } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  btn: {
    color: theme.palette.grey[500],
    marginRight: 2
  },
  btn2: {
    color: 'red',
    marginLeft: 10,
    alignSelf: 'center',
  },
  fileContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: theme.spacing(1, 0),
  },
  devContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    padding: theme.spacing(0.5),
    marginLeft: 20,
    marginTop: 5,
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
  },
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

const ProjectDailog = ({isEdit, open, handleClose, handleEdit, project, loading, handleSaveEdit, error, handleUpdate, dev}) => {
  const [editDev, setEditDev] = React.useState(false);
  const classes = useStyles();
  const {state} = React.useContext(UserContext);
  const [data, setData] = React.useState({
    name: project ? project.name : '',
    start_at: project ? project.start_at : '',
    end_at: project ? project.end_at : '',
    est_end_at: project ? project.est_end_at : '',
    project_pm: project ? project.project_pm : '',
    project_owner: project ? project.project_owner : '',
    ba_lead: project ? project.ba_lead : '',
    scrum_master: project ? project.scrum_master : '',
    dev_liason_officer: project ? project.dev_liason_officer : '',
    mandate: project ? project.mandate : '',
  });
  let a = moment(project.end_at);
  let b = moment();
  let c = moment(project.assign_at);

  const handleSaveChanges = () => {
    handleSaveEdit(data);
  }

  const handleClick = () => {
    setEditDev(false)
  }

  React.useEffect(() => {
    setEditDev(dev);
  }, [dev])

  const handleDelete = (index) => {
    axios.put(`${BASE_URL}/api/projects/remove-file/${project.id}/${index}`)
    .then(res => {
      console.log(res.data);
      handleUpdate(res.data.project);
      //setLoading(false);
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.statusText === "Unauthorized") {
          location.replace('/login');
      }
      //setLoading(false);
    });
  }

  const handleRemoveDev = (id) => {
    axios.put(`${BASE_URL}/api/detach-dev/${project.id}/${id}`).then(res => {
      handleUpdate(res.data)
    }).catch(err => {
      console.log(err.response);
      if (err.response.statusText === "Unauthorized") {
        location.replace('/login');
    }
    })
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
          secondary={b.diff(c) <= 0 ? 'Pending' : a.diff(b) <= 0 ? 'Completed' : 'In progress'}/>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="project_owner"
                  label="Project Owner"
                  name="project_owner"
                  autoFocus
                  value={data.project_owner}
                  onChange={e => setData({...data, project_owner: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Project Owner"
                  secondary={project.project_owner} />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="ba_lead"
                  label="BA Lead"
                  name="ba_lead"
                  autoFocus
                  value={data.ba_lead}
                  onChange={e => setData({...data, ba_lead: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="BA Lead"
                  secondary={project.ba_lead} />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="scrum_master"
                  label="Scrum Master"
                  name="scrum_master"
                  autoFocus
                  value={data.scrum_master}
                  onChange={e => setData({...data, scrum_master: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Scrum Master"
                  secondary={project.scrum_master} />
              )}
            </Grid> 
            <Grid item xs={12} sm={6}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="dev_liason_officer"
                  label="Dev Liason Officer"
                  name="dev_liason_officer"
                  autoFocus
                  value={data.dev_liason_officer}
                  onChange={e => setData({...data, dev_liason_officer: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Dev Liason Officer"
                  secondary={project.dev_liason_officer} />
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h6">
                Documents
              </Typography>
              {project.media?.map((data, index) => {
                const fileExt = data.file_name.split('.').pop();
                return (
                  <div className={classes.fileContainer} key={data.id}>
                    <div style={{width: 25, height: 25, marginRight: 10, marginBottom: 10}}>
                      <FileIcon extension={fileExt} {...defaultStyles[fileExt]} />
                    </div>           
                    <Typography style={{fontSize: 18}}>
                    <a href={`${BASE_URL}/download/${data.id}`}>{data.file_name}</a></Typography>
                    {state.user?.roles[0]?.name !== 'developer' && (
                      <IconButton
                        aria-label="close" 
                        className={classes.button}
                        onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </div>
                )
              })}
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
                  onClick={() => project.developers?.length === 0 &&setEditDev(true)} 
                  primary="Developer"
                  secondary={
                    project.developers?.length > 0 && project.developers.map(dev => (
                      <div className={classes.devContainer} key={dev.id}>
                        <Typography>{dev.name}</Typography>
                        <Button
                          type="submit"
                          variant="text"
                          color="primary"
                          size="small"
                          onClick={() => handleRemoveDev(dev.id)}
                          className={classes.btn2}
                          >
                          Remove
                        </Button>
                      </div>
                    ))
                    }/>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
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
                  defaultValue={moment(data.start_at).format('L')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => setData({...data, start_at: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Start Date"
                  secondary={moment(project.start_at).format('MMM Do YYYY')} 
                />
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="est_end_date"
                  label="Estimated End Date"
                  name="est_end_date"
                  type=""
                  autoFocus
                  defaultValue={moment(data.est_end_at).format('L')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => setData({...data, est_end_at: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="Estimated End Date"
                  secondary={moment(project.est_end_at).format('MMM Do YYYY')}/>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              {isEdit ? (
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="end_date"
                  label="End Date"
                  name="end_date"
                  type=""
                  autoFocus
                  defaultValue={moment(data.end_at).format('L')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => setData({...data, end_at: e.target.value})}
                />
              ) : (
                <ListItemText
                  primary="End Date"
                  secondary={moment(project.end_at).format('MMM Do YYYY')}/>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        {isEdit ? (
          <DialogActions>
            <Button
              onClick={handleSaveChanges}
              color="primary"
              disabled={loading || !data.name || !data.start_at || !data.end_at}>
              Save changes
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </>
  )
}

export default ProjectDailog;
