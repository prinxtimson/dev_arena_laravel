import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from '../components/AppContainer';
import { UserContext } from '../context/GlobalState';
import Alert from '@material-ui/lab/Alert';
import AppNavBar from '../components/AppNavBar';


const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(3, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  root: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
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

export default function SignIn() {
  const classes = useStyles();
  const context = React.useContext(UserContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    context.login({email, password})
  }

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <AppContainer>
      <AppNavBar />
      <div className={classes.root}>
        <Container component="main" maxWidth="xs" className="card">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4">
                    Sign in
                </Typography>
                
                <form className={classes.form} noValidate>
                {context.state.error ? (
                    <Alert onClose={() => {context.clearError(context.state)}} severity="error">
                        {context.state.error.message}
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={show ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                              <InputAdornment position="end">
                                  <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                  >
                                      {show ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                              </InputAdornment>
                          )
                      }}
                    />  
                    <Grid container alignItems="center">
                        <Grid item xs>
                        <FormControlLabel
                            className={classes.checkboxLabel}
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                            //si
                        />
                        </Grid>
                        <Grid item>
                        <Link href="/forgot-password" variant="body1">
                            Forgot password?
                        </Link>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        disabled={context.state.loading}
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </Container>
      </div>
    </AppContainer>
  );
}