import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from '../components/AppContainer';


const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(3, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    textAlign: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
  },
  headerText: {
      margin: theme.spacing(3, 0)
  }
}));

function ForgotPassPage() {
    const classes = useStyles();

    return (
      <AppContainer>
          <Container component="main" maxWidth="xs" className="card">
              <CssBaseline />
              <div className={classes.paper}>
                  <Typography
                      component="h1"
                      variant="h4"
                      className={classes.headerText}
                  >
                      Forgot your password?
                  </Typography>
                  <Typography component="h1" variant="body2">
                  Please enter the email address associated with your account and We will email you a link to reset your password.
                  </Typography>
                  <form className={classes.form} noValidate>
                      <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                      />
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          className={classes.submit}
                      >
                          Reset Password
                      </Button>
                      <Link href="/login" variant="body1">
                          Remember Password?
                      </Link>
                  </form>
              </div>
          </Container>
      </AppContainer>
    );
}

export default ForgotPassPage;
