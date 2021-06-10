import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserContext } from '../context/GlobalState';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(3)
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
  fileContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: theme.spacing(3, 0),
  },
  fileList: {
    display: 'flex',
    justifyContent: 'center'
  },
  fileName: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  btn: {
    padding: theme.spacing(0.5),
    marginLeft: 20,
    marginTop: 5,
  },
}));

const ProjectDocuments = ({id}) => {
  const classes = useStyles();
  const {state} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(false);
  const [project, setProject] = React.useState({
    media: []
  });
  const [file, setFile] = React.useState(null);
  const [msg, setMsg] = React.useState(null)

  const handleSubmit = () => {
    setLoading2(true);
    let formData = new FormData();
    
    formData.append('files[]', file); 
    formData.append('_method', 'put');

    axios.post(`${BASE_URL}/api/projects/${id}`, formData)
        .then(res => {
            setLoading2(false);
            setMsg(res.data.msg);
            setProject(res.data.project);
            setFile(null)
        })
        .catch(err => {
            console.log(err.response);
            setLoading2(false);
            setError(err.response.data);
        })
  }

  const handleDelete = (index) => {
    axios.put(`${BASE_URL}/api/projects/remove-file/${project.id}/${index}`)
    .then(res => {
      setProject(res.data.project);
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.statusText === "Unauthorized") {
          location.replace('/login');
      }
    });
  }

  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/projects/${id}`)
      .then(res => {
        setProject(res.data);
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response);
        setLoading(false);
      });
  }, []);

  return (
    <Paper className={classes.root} elevation={0}>
      <Grid container spacing={2}>
        {state.user && state.user.roles[0].name !== 'developer' && (
          <Grid item sm={4} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '35%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                        Select
                        <input
                          type="file"
                          onChange={e => setFile(e.target.files[0])}
                          hidden
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    color="primary"
                    variant="outlined"
                    disabled={loading2 || !file}
                    onClick={handleSubmit}>
                    Save File
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        )}       
        <Grid item sm={state.user && state.user.roles[0].name !== 'developer' ? 8 : 12} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '45%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              {project.media?.map((data, index) => {
                const fileExt = data.file_name.split('.').pop();
                return (
                  <div className={classes.fileContainer} key={data.id}>
                    <div style={{width: 30, height: 30, marginRight: 10, marginBottom: 10}}>
                      <FileIcon extension={fileExt} {...defaultStyles[fileExt]} />
                    </div>           
                    <Typography style={{fontSize: 18}}>
                    <a href={`${BASE_URL}/download/${data.id}`}>{data.file_name}</a></Typography>
                    {state.user?.roles[0]?.name !== 'developer' && (
                      <IconButton
                        aria-label="close" 
                        className={classes.btn}
                        onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </div>
                )
              })}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ProjectDocuments;
