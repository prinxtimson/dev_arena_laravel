import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from './AppContainer';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { UserContext } from '../context/GlobalState';
import { axios, BASE_URL, generatePassword } from '../utils/utils';


const useStyles = makeStyles((theme) => ({
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

const AddUserForm = () => {
    const classes = useStyles();
    const {state} = React.useContext(UserContext);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);
    const [data, setData] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        role: state.user?.roles[0]?.name === 'admin' ? 'developer': '',
        password: '',
        confirm_password: '',
        showPassword: false
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`${BASE_URL}/api/users`, data)
        .then(res => {
            setLoading(false);
            setMsg(res.data.msg);
            setData({
                firstname: '',
                lastname: '',
                email: '',
                role: '',
                password: '',
                confirm_password: '',
                showPassword: false
            });
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

  const handleOnFocus = () => {
    const generatedPass = generatePassword(8);
    setData({
        ...data,
        password: generatedPass,
        confirm_password: generatedPass
    })
  }

  
  const handleClickShowPassword = () => {
    setData({ ...data, showPassword: !data.showPassword });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };


  return (
    <AppContainer>
        <Container component="main" maxWidth="xs" className="card">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h4">
                    Add User
                </Typography>
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
                        id="firstname"
                        label="Firstname"
                        name="firstname"
                        autoFocus
                        value={data.firstname}
                        onChange={e => setData({...data, firstname: e.target.value})}
                    />
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
                    <TextField
                        id="role"
                        select
                        margin="normal"
                        fullWidth
                        required
                        label="Role"
                        value={data.role}
                        onChange={e => setData({...data, role: e.target.value})}
                        SelectProps={{
                            native: true,
                        }}
                        //helperText="Please select your role"
                        variant="outlined"
                    >
                        <option />
                        {state.user?.roles[0]?.name === 'super-admin' && (
                            <option value="admin">
                                Admin
                            </option>
                        )}
                        <option value="developer" selected={state.user?.roles[0]?.name === 'admin'}>
                            Developer
                        </option>
                    </TextField>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={data.showPassword ? 'text' : 'password'}
                        id="password"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {data.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        value={data.password}
                        onFocus={handleOnFocus}
                        onChange={e => setData({...data, password: e.target.value})}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        disabled={loading || !data.firstname || !data.lastname || !data.email || !data.password || !data.role || data.password != data.confirm_password}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Container>
    </AppContainer>
  );
}

export default AddUserForm;
