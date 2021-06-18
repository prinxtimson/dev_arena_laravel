import React from 'react';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {UserContext} from '../context/GlobalState';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    paddingTop: theme.spacing(3),
    borderRadius: 15,
    backgroundColor: '#530f77',
  },
  title: {
    flex: '1 1 100%',
    margin: theme.spacing(0, 0, 3, 2),
    color: 'white'
  }
}));

const ProfileForm = () => {
  const classes = useStyles();
  const {state, updateUser} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const [data, setData] = React.useState({
    firstname: '',
    lastname: '',
    dev_stack: '',
    phone: '',
    github: '',
    location: ''
  });

  React.useEffect(() => {
    setData({
      firstname: state.user?.profile.firstname,
      lastname: state.user?.profile.lastname,
      dev_stack: state.user?.profile.dev_stack ? state.user.profile.dev_stack : '',
      phone: state.user?.profile.phone ? state.user.profile.phone : '',
      github: state.user?.profile.github ? state.user.profile.github : '',
      location: state.user?.profile.location ? state.user.profile.location : '',
    })
  }, [state.user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.put(`${BASE_URL}/api/update`, data)
        .then(res => {
          updateUser({user: res.data.user});
          setMsg(res.data.msg);
          setLoading(false);
        })
        .catch(err => {
          console.log(err.response);
          setLoading(false);
        });
  }

  return (
    <Paper className={classes.paper} elevation={5}>
      <CssBaseline />
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
      <Typography
          variant="h6"
          id="tableTitle"
          component="div"
          className={classes.title}
        >
          Update Profile
        </Typography>
      <form noValidate style={{backgroundColor: 'white', padding: 20, borderBottomLeftRadius: 15, borderBottomRightRadius: 15}}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstname"
              label="Firstname"
              name="firstname"
              autoFocus
              value={data.firstname}
              onChange={e => setData({...data, firstname: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Lastname"
              name="lastname"
              value={data.lastname}
              onChange={e => setData({...data, lastname: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="phone_number"
              label="Phone Number"
              name="phone"
              value={data.phone}
              onChange={e => setData({...data, phone: e.target.value})}
            />
          </Grid>
          {state.user?.roles[0].name === 'developer' && (
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="location"
                label="Location"
                name="location"
                value={data.location}
                onChange={e => setData({...data, location: e.target.value})}
              />
            </Grid>
          )}
          {state.user?.roles[0].name === 'developer' && (
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="github_url"
                label="Github URL"
                name="github_url"
                value={data.github}
                onChange={e => setData({...data, github: e.target.value})}
              />
            </Grid>
          )}
          {state.user?.roles[0].name === 'developer' && (
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="dev_stack"
                label="Dev Stack"
                name="dev_stack"
                value={data.dev_stack}
                onChange={e => setData({...data, dev_stack: e.target.value})}
              />
            </Grid>
          )}   
          <Grid item xs={12} md={6} />
          <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={loading || !data.firstname || !data.lastname}
              //className={classes.submit}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

export default ProfileForm;
