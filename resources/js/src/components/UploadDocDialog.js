import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { BASE_URL, axios } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 530
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
  container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  textfield: {
    flexGrow: 1,
  },
  btn: {
    color: theme.palette.grey[500],
    marginRight: 2
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const UploadDocDialog = ({open, handleClose, project, handleUpdate, setError, error}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [msg, setMsg] = React.useState(null)

  const handleSubmit = () => {
    setLoading(true);
    let formData = new FormData();
    
    formData.append('files[]', file); 
    formData.append('_method', 'put');

    axios.post(`${BASE_URL}/api/projects/${project.id}`, formData)
        .then(res => {
            setLoading(false);
            setMsg(res.data.msg);
            handleUpdate(res.data.project);
            setFile(null)
        })
        .catch(err => {
            console.log(err.response);
            setLoading(false);
            setError(err.response.data);
        })
    
  }

  const handleOnClose = () => {
    handleClose();
    setFile(null);
  }

  return (
    <Dialog className={classes.root} onClose={handleOnClose} aria-labelledby="dialog-title" open={open}>
      <MuiDialogTitle>
        {project.name}
      </MuiDialogTitle>
      <DialogContent>
        {error && (
          <Alert onClose={() => setError(null)} severity="error">
            {error.message}
          </Alert>
        )}
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
        <Grid container spacing={0} justify="center" alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              variant="outlined"
              fullWidth
              id="file"
              margin="dense"
              disabled
              className={classes.textfield}
              value={file? file.name : ''}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
                variant="contained"
                component="label"
            >
              Select File
              <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                hidden
              />
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading || !file}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UploadDocDialog;
