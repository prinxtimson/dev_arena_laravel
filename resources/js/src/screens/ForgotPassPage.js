import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from '../components/AppContainer';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { axios, BASE_URL } from '../utils/utils';


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
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);

    const handleOnSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`${BASE_URL}/api/forgot-password`, {email})
            .then(res => {
                setLoading(false);
                setEmail('');
                setMsg('An email has been sent to you, please check your email.');
            })
            .catch(err => {
                console.log(err.response);
                setLoading(false);
                if(err.response.status === 500){
                    setError({message: 'Server Error, Please try again.'});
                    return;
                }
                setError(err.response.data);
            })
    }

    return (
      <AppContainer>
          <Container component="main" maxWidth="xs" className="card">
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
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                      />
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          className={classes.submit}
                          disabled={loading || !email}
                          onClick={handleOnSubmit}
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
