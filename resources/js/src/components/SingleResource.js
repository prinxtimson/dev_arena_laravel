import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { UserContext } from '../context/GlobalState';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { ReactTinyLink } from 'react-tiny-link'
import AppContainer from './AppContainer';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { axios, BASE_URL } from '../utils/utils';
import EditResourceForm from './EditResourceForm';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  titleContainer: {
    //: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(5)
  },
  fileContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: theme.spacing(3, 0),
  },
  textContainer: {
    margin: theme.spacing(5, 0),
  },
  linkContainer: {
    margin: theme.spacing(2, 0),
  },
  btn: {
    padding: theme.spacing(0.5),
    marginLeft: 20,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  submit: {
    padding: theme.spacing(0)
  }
}));

const SingleResource = () => {
  const classes = useStyles();
  const {state} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [resource, setResource] = React.useState(null);
  const [isEdit, setIsEdit] = React.useState(false);
  let history = useHistory();
  const {id} = useParams();

  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/resources/${id}`)
    .then(res => {
      console.log(res.data);
      setResource(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.statusText === "Unauthorized") {
          location.replace('/login');
      }
      setLoading(false);
    });
  },[]);

  const handleResourceUpdate = (data) => {
    setResource(data);
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
    } catch (_) {
      return false
    }
    return true;
  }

  const handleFileDelete = (index) => {
    axios.put(`${BASE_URL}/api/resources/remove-file/${id}/${index}`)
    .then(res => {
      console.log(res.data);
      setResource(res.data);
      //setLoading(false);
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.statusText === "Unauthorized") {
          location.replace('/login');
      }
      //setLoading(false);
    });
  }

  const handleDelete = () => {
    axios.delete(`${BASE_URL}/api/resources/${id}`)
    .then(res => {
      console.log(res.data);
      history.push('/dashboard/resources');
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.statusText === "Unauthorized") {
          location.replace('/login');
      }
    });
  }

  return (
    <AppContainer>
      <CssBaseline />
      {loading ? (
          <Skeleton variant="rect" width="100%" height={518} />
        ) : isEdit ? (
          <EditResourceForm resource={resource} handleResourceUpdate={handleResourceUpdate} setIsEdit={setIsEdit} />
        ) : (
          <Container component="main" maxWidth="md" className="card">
            <div className={classes.titleContainer}>
              <Typography component="h5" variant="h3" align="center">
                {resource.title}
              </Typography>
              <div className={classes.container}>
              <Typography>
                {moment(resource.created_at).format('MMM Do YYYY')}  |
              </Typography>
              {state.user?.id === resource.user_id &&  (
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  className={classes.submit}
                  onClick={() => setIsEdit(true)}
                >
                  Edit
                </Button>
              )}
              {state.user?.id === resource.user_id &&  (
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  className={classes.submit}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              </div>
            </div>
            {resource.url && isValidUrl(resource.url) && (
              <div className={classes.linkContainer}>
                <ReactTinyLink
                  cardSize="small"
                  showGraphic={true}
                  maxLine={2}
                  minLine={1}
                  url={resource.url}
                  width="40vw"
                />
              </div>
            )}
            {resource.media?.map((data, index) => {
              const fileExt = data.file_name.split('.').pop();
              return (
                <div className={classes.fileContainer} key={data.id}>
                  <div style={{width: 40, height: 40, marginRight: 10, marginBottom: 10}}>
                    <FileIcon extension={fileExt} {...defaultStyles[fileExt]} />
                  </div>           
                  <Typography style={{fontSize: 20}}>
                    <a href={`${BASE_URL}/download/${data.id}`}>{data.file_name}</a>
                  </Typography>
                  {state.user?.id === resource.user_id && (
                    <IconButton
                      aria-label="close" 
                      className={classes.btn}
                      onClick={() => handleFileDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              )
            })}
            <div>
              
            </div>
            <div className={classes.textContainer}>
              <Typography>{resource.description}</Typography>
            </div>
          </Container>
      )}
    </AppContainer>
  )
}

export default SingleResource;
