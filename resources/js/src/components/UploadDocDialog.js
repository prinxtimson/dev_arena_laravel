import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import { BASE_URL, axios } from '../utils/utils';

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
  btn: {
    color: theme.palette.grey[500],
    marginRight: 2
  },
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
  const [files, setFiles] = React.useState([]);
  const [msg, setMsg] = React.useState(null)

  const handleDelete = (index) => {
    const newFiles = files.filter((file, i) => i !== index);
    setFiles(newFiles);
  }

  const handleOnFileSelect = (file) => {
    setMsg(null)
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
    formData.append('_method', 'put');
    axios.post(`${BASE_URL}/api/projects/${project.id}`, formData)
        .then(res => {
            setLoading(false);
            setMsg(res.data.msg);
            handleUpdate(...res.data.project);
        })
        .catch(err => {
            console.log(err.response);
            setLoading(false);
            setError(err.response.data);
        })
    
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={open}>
      <MuiDialogTitle disableTypography>
        {project.name}
      </MuiDialogTitle>
      <DialogContent>
        {error && (
          <Alert onClose={() => setError(null)} severity="error">
            {error.message}
          </Alert>
        )}
        {files.length > 0 && files.map((file, index) => (
            <div className={classes.fileList} key={`${index}`}>
                <Typography className={classes.fileName}>
                    {file.name}
                </Typography>
                {loading ? (
                  <CircularProgress className={classes.btn} />
                ) : msg ? (
                  <DoneIcon />
                ) : (
                  <IconButton
                    aria-label="close" 
                    className={classes.btn}
                    onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading || files.length == 0}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UploadDocDialog;
