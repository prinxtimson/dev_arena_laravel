import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import { UserContext } from '../context/GlobalState';
import { BASE_URL, axios } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0), 
    backgroundColor: 'whitesmoke'
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
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));

const StyledCardContent = withStyles((theme) => ({
  root: {
    padding: 5,
    paddingLeft: '12%',
  },
}))(CardContent);

const StyledCardActions = withStyles((theme) => ({
  root: {
    padding: 5,
    paddingLeft: '12%',
  },
}))(CardActions);

const StyledListItemSecondaryAction = withStyles((theme) => ({
  root: {
    top: '20%'
  },
}))(ListItemSecondaryAction);

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
  const [isEdit, setIsEdit] = React.useState(null);
  const [editLoading, setEditLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [comments, setComments] = React.useState(blocker.comments)
  const [comment, setComment] = React.useState({
    text: '',
    issue_id: blocker.id
  });
  const d = moment();
  const createdAt = moment(blocker.created_at);
  const hours = moment.duration(d.diff(createdAt)).asHours();

  const handleClick = () => {
    setEdit(false)
  }

  const handleEditClick = data => {
    setText(data.text)
    setIsEdit(data.id);
  }

  const handleEditCancel = () => {
    setText('')
    setIsEdit(null)
  }

  const handleOnEdit = () => {
    setEditLoading(true);
    axios.put(`${BASE_URL}/api/comments/${isEdit}`, {text}).then(res => {
      const index = comments.findIndex(val => val.id === res.data.id);
      comments.splice(index, 1, res.data);
      setComments([...comments]);
      handleEditCancel()
      setEditLoading(false);
    }).catch(err => {
      console.log(err.response);
      setEditLoading(false);
    })
  }

  const handleDeleteComment = (id) => {
    axios.delete(`${BASE_URL}/api/comments/${id}`).then(res => {
      const newComments = comments.filter(val => val.id !== id);
      setComments([...newComments]);
    }).catch(err => {
      console.log(err.response);
    })
  }

  const handleOnClose = () => {
    axios.get(`${BASE_URL}/api/issues/close/${blocker.id}`)
        .then(res => {
            handleUpdate(res.data);
        }).catch(err => {
          console.log(err.response);
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
      setComments([res.data, ...comments]);
      setLoading(false);
      setComment({...comment, text: ''})
    }).catch(err => {
      console.log(err.response);
      setLoading(false);
    })
  }

  return (
    <Card className={classes.root} elevation={0} key={blocker.id}>
      <CardHeader
        avatar={
          <Avatar alt={blocker.user.name} src={blocker.user.avatar} className={classes.avatar} />
        }
        action={
          <Typography color="textSecondary">
            {blocker.ticket_no}   
          </Typography>
        }
        title={blocker.user.name}
        subheader={moment(blocker.created_at).format('lll')}
      />
      {edit ? (
        <StyledCardContent>
          <CustomTextField
            blocker={blocker}
            handleClick={handleClick}
            handleUpdate={handleUpdate}
          />
        </StyledCardContent>
      ) : (
        <>
          <StyledCardContent>
            <Typography variant="body2" component="p">
              {blocker.details}
            </Typography>
          </StyledCardContent>
            {isPermitted ? (
              <StyledCardActions>
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  onClick={() => setEdit(true)}
                  disabled={Boolean(blocker.resolve_at) || Boolean(hours >= 2)}
                  className={classes.button}
                  startIcon={<EditIcon />}>
                  Edit
                </Button>
              </StyledCardActions>
            ) : state.user?.roles[0].name !== 'developer' && (
              <StyledCardActions>
                <Button
                  size="small"
                  variant="text"
                  color="primary"
                  disabled={Boolean(blocker.resolve_at)}
                  onClick={handleOnClose}
                  className={classes.button}
                  startIcon={<DoneAllIcon />}>
                  Resolved
                </Button>
              </StyledCardActions>
            )}
          <StyledCardContent>
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
                        isEdit === val.id ? (
                          <React.Fragment>
                            <TextField
                              id="comment"
                              margin="dense"
                              label="Enter Comment"
                              multiline
                              rows={2}
                              className={classes.inline}
                              value={text}
                              onChange={e => setText(e.target.value)}
                              variant="outlined"
                            />
                            <React.Fragment>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={handleOnEdit}
                                className={classes.button}
                                disabled={editLoading}
                                startIcon={<EditIcon />}>
                                Submit
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="default"
                                className={classes.button}
                                onClick={handleEditCancel}
                                startIcon={<DeleteIcon />}>
                                Cancel
                              </Button>
                            </React.Fragment>
                          </React.Fragment>
                        ) : (
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {`${val.text}`}
                          </Typography>
                          {state.user?.id === val.user.id && (
                            <React.Fragment>
                                <Button
                                  size="small"
                                  variant="text"
                                  color="primary"
                                  onClick={() => handleEditClick(val)}
                                  className={classes.button}
                                  startIcon={<EditIcon />}>
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  color="secondary"
                                  className={classes.button}
                                  onClick={() => handleDeleteComment(val.id)}
                                  startIcon={<DeleteIcon />}>
                                  Delete
                                </Button>
                            </React.Fragment>
                          )}
                        </React.Fragment>
                        )
                      }
                    />
                    <StyledListItemSecondaryAction>
                      <Typography color="textSecondary" style={{fontSize: 13}}>
                        {moment(val.created_at).format('lll')}
                      </Typography>
                    </StyledListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </StyledCardContent>
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
            <Paper className={classes.paper} elevation={5}>
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
              <Paper className={classes.paper} elevation={5}>
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
            <Paper className={classes.paper} elevation={5}>
              {blockers.length > 0 && blockers.map((blocker, index) => (
                <div key={blocker.id}>
                  <RenderCard
                    key={blocker.id}
                    state={state}
                    isPermitted={isPermitted}
                    handleOpen={handleOpen}
                    handleUpdate={handleUpdate}
                    blocker={blocker}/>
                  {blockers.length-1 === index ? null : (
                    <Divider />
                  )}  
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
