import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { UserContext } from '../context/GlobalState';
import moment from 'moment';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
    backgroundColor: 'whitesmoke'
  },
  paper: {
    padding: theme.spacing(3)
  },
  textfield: {
    width: '100%',
  },
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
  const [edit, setEdit] = React.useState(false);
  const d = moment();
  const createdAt = moment(report.created_at);
  const hours = moment.duration(d.diff(createdAt)).asHours();

  const handleClick = () => {
    setEdit(false)
  }

  return (
    <Card className={classes.root} elevation={0} key={report.id}>
      <CardHeader
        avatar={
          <Avatar alt={report.user.name} src={report.user.avatar} className={classes.avatar} />
        }
        title={report.user.name}
        subheader={moment(report.created_at).format('lll')}
      />
      {edit ? (
        <StyledCardContent>
          <CustomTextField
            report={report}
            handleClick={handleClick}
            handleUpdate={handleUpdate}
          />
        </StyledCardContent>
      ) : ( 
        <>
          <StyledCardContent>
            <Typography variant="body2" component="p">
              {report.details}
            </Typography>
          </StyledCardContent>
          {state.user?.id === report.user_id && (
            <StyledCardActions>
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={() => setEdit(true)}
                disabled={Boolean(hours >= 2)}
                className={classes.button}
                startIcon={<EditIcon />}>
                Edit
              </Button>
            </StyledCardActions>
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

const DailyReports = () => {
  const classes = useStyles();
  const {state} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [formLoading, setFormLoading] = React.useState(false);
  const [reports, setReports] = React.useState([])
  const [details, setDetails] = React.useState('');
  const [reportId, setReportId] = React.useState(null);
  const [search, setSearch] = React.useState({
    from: '',
    to: ''
  });

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
    axios.get(`${BASE_URL}/api/reports`)
      .then(res => {
        setReports(res.data);
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
      axios.get(`${BASE_URL}/api/reports?${from && `from=${new Date(from).toISOString()}`}${to && from ? `&to=${new Date(to).toISOString()}` : to && !from && `to=${new Date(to).toISOString()}`}`)
      .then(res => {
        setReports(res.data);
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
    axios.get(`${BASE_URL}/api/reports`)
      .then(res => {
        setReports(res.data);
      })
      .catch(err => {
        console.log(err.response);
      });
  }

  const handleOnSave = () => {
    setFormLoading(true)
    axios.post(`${BASE_URL}/api/reports`, {details})
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

  const handleExport = () => {
    const {from, to} = search;
    if (from || to) {
      window.location.href = `${BASE_URL}/reports/export?${from && `from=${from}`}${to && from ? `&to=${to}` : to && !from && `to=${to}`}`
    }else {
      window.location.href = `${BASE_URL}/reports/export`
    }
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
        <Grid item sm={4} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '35%' }} />
            </Skeleton>
          ) : state.user?.roles[0].name === 'developer' ? (          
            <Paper className={classes.paper} elevation={5}>
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
                    disabled={formLoading || !details}
                    onClick={handleOnSave}>
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
                        variant="contained"
                        fullWidth
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
              {reports.length > 0 && reports.map((report, index) => state.user?.roles[0]?.name !== 'developer' ? (
                <div key={report.id}>
                  <RenderCard
                    state={state}
                    report={report}
                    handleOpen={handleOpen}
                    handleUpdate={handleUpdate}
                  />
                  {reports.length-1 === index ? null : (
                    <Divider />
                  )}
                </div>
              ) : state.user?.id === report.user_id && (
                <div key={report.id}>
                  <RenderCard
                    state={state}
                    report={report}
                    handleOpen={handleOpen}
                    handleUpdate={handleUpdate}
                  />
                  {reports.length-1 === index ? null : (
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

export default DailyReports;
