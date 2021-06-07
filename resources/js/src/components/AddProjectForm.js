import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppContainer from './AppContainer';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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
    const [files, setFiles] = React.useState([]);
    const [data, setData] = React.useState({
        name: '',
        start_at: '',
        est_end_at: '',
        slug: '',
        avatar: 'sample.com',
        mandate: '',
        project_pm: '',
        project_owner: '',
        ba_lead: '',
        scrum_master: '',
        dev_liason_officer: '',
        end_at: '',
    });

    const handleDelete = (index) => {
        const newFiles = files.filter((file, i) => i !== index);
        setFiles(newFiles);
      }
    
      const handleOnFileSelect = (file) => {
        for (let key in file){
          if (file.hasOwnProperty(key)) {
            setFiles([file[key], ...files]);
          }
        }
      }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();
    files.forEach(file => {
      formData.append('files[]', file);
    })
    for(let key in data) {
        formData.append(key, data[key]);
    }
    axios.post(`${BASE_URL}/api/projects`, formData)
        .then(res => {
            setLoading(false);
            setMsg(res.data.msg);
            setData({
              name: '',
              start_at: '',
              est_end_at: '',
              end_at: '',
              slug: '',
              mandate: '',
              project_pm: '',
              ba_lead: '',
              scrum_master: '',
              project_owner: '',
              dev_liason_officer: '',
            });
            setFiles([]);
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
                        id="project_pm"
                        label="Project PM"
                        name="project_pm"
                        value={data.project_pm}
                        onChange={e => setData({...data, project_pm: e.target.value})}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="project_owner"
                        label="Project Owner"
                        name="project_owner"
                        value={data.project_owner}
                        onChange={e => setData({...data, project_owner: e.target.value})}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="scrum_master"
                        label="Scrum Master"
                        name="scrum_master"
                        value={data.scrum_master}
                        onChange={e => setData({...data, scrum_master: e.target.value})}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="ba_lead"
                        label="BA Lead"
                        name="ba_lead"
                        value={data.ba_lead}
                        onChange={e => setData({...data, ba_lead: e.target.value})}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="dev_liason_officer"
                        label="Dev Liason Officer"
                        name="dev_liason_officer"
                        value={data.dev_liason_officer}
                        onChange={e => setData({...data, dev_liason_officer: e.target.value})}
                    />
                    {files.length > 0 && files.map((file, index) => (
                        <div className={classes.fileList} key={`${index}`}>
                            <Typography className={classes.fileName}>
                                {file.name}
                            </Typography>
                            <IconButton
                                aria-label="close" 
                                className={classes.btn}
                                onClick={() => handleDelete(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ))}
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Select File
                        <input
                            type="file"
                            onChange={e => handleOnFileSelect(e.target.files)}
                            hidden
                        />
                    </Button>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        multiline
                        rows={4}
                        id="mandate"
                        label="Project Mandate"
                        name="mandate"
                        value={data.mandate}
                        onChange={e => setData({...data, mandate: e.target.value})}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="start_at"
                        label="Start Date"
                        type="date"
                        name="start_at"
                        defaultValue={window.Date.now()}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={e => setData({...data, start_at: e.target.value})}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="est_end_at"
                        label="Estimated End Date"
                        name="est_end_at"
                        type="date"
                        defaultValue={window.Date.now()}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={e => {
                          setData({...data, est_end_at: e.target.value, end_at: e.target.value})
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        disabled={loading || !data.name || !data.est_end_at || !data.start_at}
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
