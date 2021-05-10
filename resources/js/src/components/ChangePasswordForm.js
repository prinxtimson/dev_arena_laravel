import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from './AppContainer';
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
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(1.5),
    },
}));

const ChangePasswordForm = () => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const passwordValidation = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if(!passwordValidation.test(newPassword)){
        return;
    }
    axios.put(`${BASE_URL}/change-password`, {
        password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword
    }).then(res => {
        setLoading(false);
        setMsg(res.data.msg);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
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
            <div className={classes.paper}>
                <Typography component="h1" variant="h4">
                    Change Password
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
                        name="current_password"
                        label="Current Password"
                        type="password"
                        id="current_password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                    />  
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="new_password"
                        error={newPassword && !passwordValidation.test(newPassword)}
                        helperText="Must contain at least one of each sets A-Z,a-z,0-9 and minimum of 8 characters."
                        label="New Password"
                        type="password"
                        id="new_password"
                        autoComplete="current-password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />  
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirm_new_password"
                        label="Confirm New Password"
                        type="password"
                        id="confirm_new_password"
                        autoComplete="current-password"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                    />  
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        disabled={loading || !currentPassword || !newPassword || newPassword !== confirmNewPassword}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Container>
    </AppContainer>
    )
}

export default ChangePasswordForm;
