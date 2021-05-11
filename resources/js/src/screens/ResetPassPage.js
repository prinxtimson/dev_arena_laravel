import React from 'react';
import Button from '@material-ui/core/Button';
import { useLocation, useParams } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from '../components/AppContainer';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { axios, BASE_URL } from '../utils/utils';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


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

export default function ResetPassPage() {
  const classes = useStyles();
  const {token} = useParams();
  const search = new URLSearchParams(useLocation().search);
  const [data, setData] = React.useState({
    email: search.get('email'),
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!passwordValidation.test(data.password)){
        return;
    }
    setLoading(true);
    axios.post(`${BASE_URL}/api/reset-password`, {token, ...data})
        .then(() => {
          setLoading(false);
          setData({password: '', password_confirmation: ''});
          setMsg('Your password had been updated successfully.')
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

  const handleClickShow = () => {
    setShow(!show);
  };

  const handleClickShow2 = () => {
    setShow2(!show2);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };


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
                    Reset your password?
                </Typography>
                <Typography component="h1" variant="body2">
                   Please enter your new password and confirm your new password to reset your password.
                </Typography>
                <form className={classes.form} noValidate>
                    {error ? (
                        <Alert onClose={() => setError(null)} severity="error">
                            {error.message}
                        </Alert>
                    ) : null}
                    <Typography
                      component="h1"
                      variant="h6" 
                      className={classes.headerText}
                    >
                        {data.email}
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        error={data.password && !passwordValidation.test(data.password)}
                        label="Password"
                        type={show ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        helperText="Must contain at least one of each sets A-Z,a-z,0-9 and minimum of 8 characters."
                        onChange={e => setData({...data, password: e.target.value})}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShow}
                                        onMouseDown={handleMouseDown}
                                    >
                                        {show ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    /> 
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password Confirmation"
                        type={show2 ? 'text' : 'password'}
                        id="password_confirmation"
                        autoComplete="current-password"
                        onChange={e => setData({...data, password_confirmation: e.target.value})}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShow2}
                                        onMouseDown={handleMouseDown}
                                    >
                                        {show2 ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        disabled={loading || !data.password || data.password !== data.password_confirmation}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Link href="/login" variant="body1">
                        Login
                    </Link>
                </form>
            </div>
        </Container>
    </AppContainer>
  );
}