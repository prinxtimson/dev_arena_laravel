import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from './AppContainer';
import { UserContext } from '../context/GlobalState';

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
    const context = React.useContext(UserContext);
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    context.login({
        password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword
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
                        disabled={context.state.loading}
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
