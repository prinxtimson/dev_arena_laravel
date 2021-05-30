import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UserContext } from '../context/GlobalState';
import moment from 'moment';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(3)
  },
  textfield: {
    width: '100%',
  },
}));

const CustomTextField = ({report, handleClick, handleUpdate}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState(report.details);

  const handleOnSave = () => {
    setLoading(true);

    axios.put(`${BASE_URL}/api/reports/${report.id}`, {details}).then(res => {
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
          id="report"
          label="Daily Report"
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

const RenderCard = ({report, handleUpdate, handleOpen, state}) => {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false)

  const handleClick = () => {
    setEdit(false)
  }

  return (
    <Card className={classes.root} elevation={0} key={report.id}>
      {edit ? (
        <CardContent>
          <CustomTextField
            report={report}
            handleClick={handleClick}
            handleUpdate={handleUpdate}
          />
        </CardContent>
      ) : (
        <>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {moment(report.created_at).format('LLLL')}
            </Typography>
            <Typography variant="body2" component="p">
              {report.details}
            </Typography>
          </CardContent>
          {state.user && state.user.id === report.user_id && (
            <CardActions>
              <Button
                size="small"
                variant="text"
                color="secondary"
                onClick={() => handleOpen(report.id)}
                className={classes.button}
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
          )}
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
              You are about to delete a report, click DELETE if you wish to continue or CANCEL to cancel
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

const DailyReports = ({id}) => {
  const classes = useStyles();
  const {state} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [isPermitted, setIspermitted] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);
  const [reports, setReports] = React.useState([])
  const [details, setDetails] = React.useState('');
  const [reportId, setReportId] = React.useState(null);

  const handleClose = () => {
    setReportId(null)
  }

  const handleOpen = (id) => {
    setReportId(id)
  }

  const handleUpdate = (report) => {
    const index = reports.findIndex(val => val.id === report.id);
    reports.splice(index, 1, report);
    setReports([...reports]);
  }
 
  const handleDelete = (id) => {
    handleClose();
    axios.delete(`${BASE_URL}/api/reports/${id}`)
        .then(() => {
            const newReports = reports.filter(report => report.id !== id);
            setReports(newReports);
        })      
  }

  React.useEffect(() => {
    const project = state.user && state.user.projects.find(project => project.id = id);
    setIspermitted(Boolean(project));
    axios.get(`${BASE_URL}/api/reports/${id}`)
      .then(res => {
        setReports(res.data);
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response);
        setLoading(false);
      });
  }, []);

  const handleOnSave = () => {
    axios.post(`${BASE_URL}/api/reports/${id}`, {details})
      .then(res => {
        setReports([res.data, ...reports]);
        setDetails('');
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
          open={Boolean(reportId)}
          id={reportId}
          handleClose={handleClose}
          handleDelete={handleDelete}
        />
      <Grid container spacing={2}>
        {state.user && state.user.roles[0].name === 'developer' && (
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
                    id="report"
                    label="Daily Report"
                    multiline
                    className={classes.textfield}
                    rows={4}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    color="primary"
                    variant="outlined"
                    disabled={formLoading || !details || !isPermitted}
                    onClick={handleOnSave}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        )}       
        <Grid item sm={state.user && state.user.roles[0].name === 'developer' ? 8 : 12} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '45%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              {reports.length > 0 && reports.map(report => (
                <RenderCard
                  key={report.id}
                  state={state}
                  report={report}
                  handleOpen={handleOpen}
                  handleUpdate={handleUpdate}
                />
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default DailyReports;
