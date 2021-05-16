import React from 'react';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const ProfileForm = () => {
  const [data, setData] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    dev_stack: '',
    phone_number: ''
  });

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
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
              id="dev_stack"
              label="Dev Stack"
              name="dev_stack"
              value={data.email}
              onChange={e => setData({...data, email: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              className={classes.submit}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default ProfileForm;
