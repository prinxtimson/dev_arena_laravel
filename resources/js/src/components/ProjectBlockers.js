import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { UserContext } from '../context/GlobalState';
import { BASE_URL, axios } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(3)
  },
  button: {
    margin: theme.spacing(1),
  },
  textfield: {
    width: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const CustomTextField = ({blocker, handleClick, handleUpdate}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState(blocker.details);

  const handleOnSave = () => {
    setLoading(true);

    axios.put(`${BASE_URL}/api/issues/${blocker.id}`, {details}).then(res => {
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          id="issue"
          label="Blocker details"
          multiline
          className={classes.textfield}
          rows={4}
          value={details}
          onChange={e => setDetails(e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button
              color="primary"
              variant="outlined"
              disabled={loading || !details}
              onClick={handleOnSave}>
              Save
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={handleClick}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const RenderCard = ({blocker, handleUpdate, handleOpen, state, isPermitted}) => {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false)

  const handleClick = () => {
    setEdit(false)
  }

  return (
    <Card className={classes.root} elevation={0} key={blocker.id}>
      {edit ? (
        <CardContent>
          <CustomTextField
            blocker={blocker}
            handleClick={handleClick}
            handleUpdate={handleUpdate}
          />
        </CardContent>
      ) : (
        <>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {moment(blocker.created_at).format('LLLL')}
            </Typography>
            <Typography variant="body2" component="p">
              {blocker.details}
            </Typography>
          </CardContent>
          <CardActions>
            {isPermitted && (
              <>
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  className={classes.button}
                  onClick={() => handleOpen(blocker.id)}
                  startIcon={<DeleteIcon />}>
                  Delete
                </Button>
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  onClick={() => setEdit(true)}
                  className={classes.button}
                  startIcon={<EditIcon />}>
                  Edit
                </Button>
              </>
            )}
            {state.user && state.user.roles[0].name === 'admin' && (
              <>
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  className={classes.button}
                  startIcon={<EditIcon />}>
                  Close
                </Button>
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  className={classes.button}
                  startIcon={<EditIcon />}>
                  Open
                </Button>
              </>
            )}
          </CardActions>
        </>
      )}
    </Card>
  )
}

const RenderConfirmDelete = ({open, id, handleClose, handleDelete}) => (
  <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
  >
      <DialogTitle id="alert-dialog-title">
          Delete Confirmation
      </DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
              You are about to delete a blocker, click DELETE if you wish to continue or CANCEL to cancel
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
          <Button onClick={() => handleDelete(id)} color="primary" autoFocus>
              Delete
          </Button>
      </DialogActions>
  </Dialog>
)

const ProjectBlockers = ({id}) => {
  const classes = useStyles();
  const {state} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [blockers, setBlockers] = React.useState([]);
  const [isPermitted, setIspermitted] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);
  const [data, setData] = React.useState({
    details: '',
  });
  const [issueId, setIssueId] = React.useState(null);

  const handleClose = () => {
    setIssueId(null)
  }

  const handleOpen = (id) => {
    setIssueId(id)
  }

  const handleUpdate = (blocker) => {
    const index = blockers.findIndex(val => val.id === blocker.id);
    blockers.splice(index, 1, blocker);
    //console.log(blockers)
    setBlockers(blockers);
  }
 
  const handleDelete = (id) => {
    handleClose();
    axios.delete(`${BASE_URL}/api/issues/${id}`)
        .then(() => {
            const newBlockers = blockers.filter(blocker => blocker.id !== id);
            setBlockers(newBlockers);
        })      
  }

  React.useEffect(() => {
    const project = state.user && state.user.projects.find(project => project.id = id);
    setIspermitted(Boolean(project));
    axios.get(`${BASE_URL}/api/issues/${id}`)
      .then(res => {
        setBlockers(res.data);
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response);
        setLoading(false);
      });
  }, []);

  const handleOnSave = () => {
    axios.post(`${BASE_URL}/api/issues/${id}`, data)
      .then(res => {
        setBlockers([res.data, ...blockers]);
        setData({
          details: '',
          assign_to: '',
        });
        setFormLoading(false)
      })
      .catch(err => {
        console.log(err.response);
        setFormLoading(false);
      });
  }

  return (
    <Paper className={classes.root} elevation={0}>
      <RenderConfirmDelete
        open={Boolean(issueId)}
        id={issueId}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '35%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="blocker"
                    label="Blocker Details"
                    className={classes.textfield}
                    multiline
                    rows={4}
                    value={data.details}
                    onChange={e => setData({...data, details: e.target.value})}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    color="primary"
                    onClick={handleOnSave}
                    disabled={formLoading || !data.details || !isPermitted}
                    variant="outlined">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '45%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              {blockers.length > 0 && blockers.map(blocker => (
                <RenderCard
                  key={blocker.id}
                  state={state}
                  isPermitted={isPermitted}
                  handleOpen={handleOpen}
                  handleUpdate={handleUpdate}
                  blocker={blocker}/>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ProjectBlockers;
