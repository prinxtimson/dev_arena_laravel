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
import DoneAllIcon from '@material-ui/icons/DoneAll';
import LoopIcon from '@material-ui/icons/Loop';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
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
  inline: {
    display: 'block',
    fontSize: 14,
  }
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
  const [loading, setLoading] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [comments, setComments] = React.useState(blocker.comments)
  const [comment, setComment] = React.useState({
    text: '',
    issue_id: blocker.id
  });

  const handleClick = () => {
    setEdit(false)
  }

  const handleOnClose = () => {
    axios.get(`${BASE_URL}/api/issues/close/${blocker.id}`)
        .then(res => {
            handleUpdate(res.data);
        })      
  }

  const handleOnOpen = () => {
    axios.get(`${BASE_URL}/api/issues/open/${blocker.id}`)
        .then(res => {
            handleUpdate(res.data);
        })      
  }

  const handleSubmitComment = () => {
    axios.post(`${BASE_URL}/api/comments`, comment).then(res => {
      console.log(res.data)
      //handleUpdate(res.data)
      setLoading(false);
      setComment({...comment, text: ''})
    }).catch(err => {
      console.log(err.response);
      setLoading(false);
    })
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
              {`${blocker.ticket_no} - ${moment(blocker.created_at).format('lll')}`}
            </Typography>
            <Typography variant="body2" component="p">
              {blocker.details}
            </Typography>
          </CardContent>
            {isPermitted ? (
              <CardActions>
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
              </CardActions>
            ) : state.user?.roles[0].name === 'admin' && (
              <CardActions>
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  disabled={Boolean(blocker.resolve_at)}
                  onClick={handleOnClose}
                  className={classes.button}
                  startIcon={<DoneAllIcon />}>
                  Close
                </Button>
                <Button
                  size="small"
                  variant="text"
                  color="secondary"
                  onClick={handleOnOpen}
                  disabled={!blocker.resolve_at}
                  className={classes.button}
                  startIcon={<LoopIcon />}>
                  Open
                </Button>
              </CardActions>
            )}
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  id="comment"
                  margin="dense"
                  label="Enter Comment"
                  multiline
                  className={classes.textfield}
                  value={comment.text}
                  onChange={e => setComment({...comment, text: e.target.value})}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  color="primary"
                  size="medium"
                  variant="contained"
                  disabled={loading}
                  onClick={handleSubmitComment}
                  >
                  Submit
                </Button>
              </Grid>
            </Grid>
            <List>
              {comments.map(val => (
                <ListItem alignItems="flex-start" key={val.id}>
                  <ListItemAvatar>
                    <Avatar alt={val.user.name} src={val.user.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={val.user.name}
                    secondary={
                      <React.Fragment>
                        {moment(val.created_at).format('lll')}
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          {`- ${val.text}`}
                        </Typography>
                        {state.user?.id === val.user.id && (
                          <React.Fragment>
                          
                              <Button
                                size="small"
                                variant="text"
                                color="primary"
                                //onClick={() => setEdit(true)}
                                className={classes.button}
                                startIcon={<EditIcon />}>
                                Edit
                              </Button>
                              <Button
                                size="small"
                                variant="text"
                                color="secondary"
                                className={classes.button}
                                //onClick={() => handleOpen(blocker.id)}
                                startIcon={<DeleteIcon />}>
                                Delete
                              </Button>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
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
  const [search, setSearch] = React.useState({
    from: '',
    to: ''
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
    setBlockers([...blockers]);
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
    const project = state.user?.projects.find(project => project.id == id);
    console.log(project)
    setIspermitted(Boolean(project));
    axios.get(`${BASE_URL}/api/issues/${id}`)
      .then(res => {
        console.log(res.data);
        setBlockers(res.data);
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response);
        setLoading(false);
      });
  }, []);

  const handleOnSearch = () => {
    const {from, to} = search;
    if(from || to) {
      setFormLoading(true)
      axios.get(`${BASE_URL}/api/issues/${id}?${from && `from=${new Date(from).toISOString()}`}${to && from ? `&to=${new Date(to).toISOString()}` : to && !from && `to=${new Date(to).toISOString()}`}`)
      .then(res => {
        setBlockers(res.data);
        setFormLoading(false)
      })
      .catch(err => {
          console.log(err.response);
          setFormLoading(false)
      });
    }  
  };

  const handleReset = () => {
    setSearch({from: '', to: ''});
    axios.get(`${BASE_URL}/api/issues/${id}`)
      .then(res => {
        setBlockers(res.data);
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  const handleOnSave = () => {
    setFormLoading(true)
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

  const handleExport = () => {
    const {from, to} = search;
    if (from || to) {
      window.location.href = `${BASE_URL}/blockers/export/${id}?${from && `from=${from}`}${to && from ? `&to=${to}` : to && !from && `to=${to}`}`
    }else {
      window.location.href = `${BASE_URL}/blockers/export/${id}`
    }
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
          ) : state.user?.roles[0]?.name === 'developer' ? (
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
          ) : (
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={handleExport}>
                      Export Reports
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="from"
                      label="From"
                      type="date"
                      value={search.from}
                      InputLabelProps={{
                        shrink: true,
                      }}                   
                      onChange={e => setSearch({
                        ...search, 
                        from: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="to"
                      label="To"
                      type="date"
                      value={search.to}
                      inputProps={{
                        min: search.from
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={e => setSearch({
                        ...search,
                        to: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          color="primary"
                          variant="outlined"
                          fullWidth
                          onClick={handleOnSearch}>
                          Search
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          color="default"
                          fullWidth
                          variant="contained"
                          onClick={handleReset}>
                          Reset
                        </Button>
                      </Grid>
                    </Grid>
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
                <div key={blocker.id}>
                  <RenderCard
                    key={blocker.id}
                    state={state}
                    isPermitted={isPermitted}
                    handleOpen={handleOpen}
                    handleUpdate={handleUpdate}
                    blocker={blocker}/>
                  <Divider />
                </div>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ProjectBlockers;
