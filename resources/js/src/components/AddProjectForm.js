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

const AddProjectForm = () => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [msg, setMsg] = React.useState(null);
    const [data, setData] = React.useState({
        name: '',
        start: '',
        end: '',
        slug: '',
        avatar: 'sample.com'
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post(`${BASE_URL}/api/projects`, data)
        .then(res => {
            setLoading(false);
            setMsg(res.data.msg);
            setData({
              name: '',
              start: '',
              end: '',
            });
        })
        .catch(err => {
            console.log(err.response);
            setLoading(false);
            setError(err.response.data);
        })
    
  }

  return (
    <AppContainer>
        <Container component="main" maxWidth="xs" className="card">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h4">
                    Add Project
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
                        id="name"
                        label="Name"
                        name="name"
                        autoFocus
                        value={data.name}
                        onChange={e => setData({
                          ...data,
                          name: e.target.value,
                          slug: e.target.value.replace(/\s+/g, "").toLowerCase()
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="start"
                        label="Start Date"
                        type="date"
                        name="start"
                        defaultValue={window.Date.now()}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={data.start}
                        onChange={e => setData({...data, start: e.target.value})}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="end"
                        label="End Date"
                        name="end"
                        type="date"
                        defaultValue={window.Date.now()}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={data.end}
                        onChange={e => setData({...data, end: e.target.value})}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        disabled={loading || !data.name || !data.end || !data.start}
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

export default AddProjectForm;
