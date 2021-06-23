import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import AppContainer from './AppContainer';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(3, 0),
    padding: theme.spacing(2.5),
    maxWidth: '80%'
  },
  paper: {
    margin: theme.spacing(3, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
  },
  checkboxLabel: {
      fontSize: 12
  }
}));

const EditProjectForm = ({id}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [data, setData] = React.useState({
    name: '',
    start_at: '',
    est_end_at: '',
    slug: '',
    mandate: '',
    project_pm: '',
    project_owner: '',
    ba_lead: '',
    scrum_master: '',
    dev_liason_officer: '',
    end_at: '',
  });

const handleSubmit = (e) => {
  e.preventDefault();
  setLoading2(true);
  let formData = new FormData();
  for(let key in data) {
    formData.append(key, data[key]);
  }
  formData.append('_method', 'put');
  axios.post(`${BASE_URL}/api/projects/${id}`, formData)
      .then(res => {
          setLoading2(false);
          setMsg(res.data.msg);
          setData(...res.data.project);
      })
      .catch(err => {
          console.log(err.response);
          setLoading2(false);
          setError(err.response.data);
      })
  
}

React.useEffect(() => {
  axios.get(`${BASE_URL}/api/projects/${id}`)
    .then(res => {
      setData(res.data);
      setLoading(false)
    })
    .catch(err => {
      console.log(err.response);
      setLoading(false);
    });
}, []);

  return (
    <AppContainer>
      {loading ? (
        <Skeleton variant="rect" width="80%">
          <div style={{ paddingTop: '45%' }} />
        </Skeleton>
      ) : (
        <Paper className={classes.root}>
          <CssBaseline />
          <div className={classes.paper}>
            <Snackbar
              open={Boolean(msg)}
              anchorOrigin={{vertical: 'top', horizontal: 'right'}}
              autoHideDuration={8000} 
              onClose={() => setMsg(null)}
            >
              <Alert
                onClose={() => setMsg(null)} 
                severity="success"
                variant="filled"
              >
                {msg}
              </Alert>
            </Snackbar>
            <form className={classes.form} noValidate>
              {error ? (
                <Alert onClose={() => setError(null)} severity="error">
                  {error.message}
                </Alert>
              ) : null}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
                value={data.name}
                onChange={e => setData({
                  ...data,
                  name: e.target.value,
                  slug: e.target.value.replace(/\s+/g, "").toLowerCase()
                })}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="project_pm"
                label="Project PM"
                name="project_pm"
                value={data.project_pm}
                onChange={e => setData({...data, project_pm: e.target.value})}
              />
               <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="project_owner"
                label="Project Owner"
                name="project_owner"
                value={data.project_owner}
                onChange={e => setData({...data, project_owner: e.target.value})}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="scrum_master"
                label="Scrum Master"
                name="scrum_master"
                value={data.scrum_master}
                onChange={e => setData({...data, scrum_master: e.target.value})}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="ba_lead"
                label="BA Lead"
                name="ba_lead"
                value={data.ba_lead}
                onChange={e => setData({...data, ba_lead: e.target.value})}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="dev_liason_officer"
                label="Dev Liason Officer"
                name="dev_liason_officer"
                value={data.dev_liason_officer}
                onChange={e => setData({...data, dev_liason_officer: e.target.value})}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                multiline
                rows={4}
                id="mandate"
                label="Project Mandate"
                name="mandate"
                value={data.mandate}
                onChange={e => setData({...data, mandate: e.target.value})}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="end_at"
                label="End Date"
                name="end_at"
                type="date"
                defaultValue={moment(data.end_at).format('L')}
                inputProps={{
                  min: moment(data.est_end_at).format('L')
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={e => setData({...data, end_at: e.target.value})}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                className={classes.submit}
                disabled={loading2 || !data.name || !data.end_at || !data.start_at}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </form>
          </div>
        </Paper>
      )}
    </AppContainer>
  );
}

export default EditProjectForm;
