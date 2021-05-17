import React from 'react';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: 15,
  },
  title: {
    flex: '1 1 100%',
    margin: theme.spacing(2, 3)
  }
}));

const ProfileForm = ({user}) => {
  const classes = useStyles();
  const [data, setData] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    dev_stack: '',
    phone: '',
    github: ''
  });

  React.useEffect(() => {
    setData({
      firstname: user && user.profile.firstname,
      lastname: user && user.profile.lastname,
      email: user && user.email,
      dev_stack: user && user.profile.dev_stack,
      phone: user && user.profile.phone,
      github: user && user.profile.github,
    })
  }, [])

  return (
    <Paper className={classes.paper}>
      <CssBaseline />
      <Typography
          variant="h6"
          id="tableTitle"
          component="div"
          className={classes.title}
        >
          Update Profile
        </Typography>
      <form noValidate>
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
              disabled
              id="email_address"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={e => setData({...data, email: e.target.value})}
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
              onChange={e => setData({...data, email: e.target.value})}
            />
          </Grid>
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
              onChange={e => setData({...data, email: e.target.value})}
            />
          </Grid>
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
              onChange={e => setData({...data, email: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6} />
          <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
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
