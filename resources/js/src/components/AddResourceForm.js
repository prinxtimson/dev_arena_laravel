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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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
  },
  fileList: {
    display: 'flex',
    justifyContent: 'center'
  },
  fileName: {
    flexGrow: 1,
    alignSelf: 'center',
  }
}));

const AddResourceForm = () => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [data, setData] = React.useState({
        title: '',
        description: '',
        url: '',
    });
  const [files, setFiles] = React.useState([]);

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
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('url', data.url);
    axios.post(`${BASE_URL}/api/resources`, formData).then(res => {
      console.log(res.data);
      setMsg(res.data.msg);
      setData({
        title: '',
        description: '',
        url: '',
      });
      setFiles([]);
      setLoading(false)
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
      <Container component="main" maxWidth="sm" className="card">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">
            Add Resource
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
              id="title"
              label="Title"
              autoFocus
              value={data.title}
              onChange={e => setData({
                ...data,
                title: e.target.value,
              })}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="url"
              label="Link"
              value={data.url}
              onChange={e => setData({...data, url: e.target.value})}
            />
            {files.length > 0 && files.map((file, index) => (
              <div className={classes.fileList} key={`${index}`}>
                <Typography className={classes.fileName}>{file.name}</Typography>
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
              rows={8}
              id="description"
              label="Resource Description"
              value={data.description}
              onChange={e => setData({...data, description: e.target.value})}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              className={classes.submit}
              disabled={loading || !data.title || !data.url || !data.description}
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

export default AddResourceForm;
