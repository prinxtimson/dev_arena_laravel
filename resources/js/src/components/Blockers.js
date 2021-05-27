import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { BASE_URL, axios } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(3)
  },
  button: {
    margin: theme.spacing(1),
  },
  textfield: {
    width: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const Blockers = ({id}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [blockers, setBlockers] = React.useState([]);
  const [options, setOptions] = React.useState([]);
  const [data, setData] = React.useState({
    details: '',
    assign_to: ''
  });

  const handleFocus = () => {
    if(options.length === 0){
      axios.get(`${BASE_URL}/api/developers`).then(res => {
        setOptions(res.data);
      })
    }
  }

  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/projects/${id}`)
      .then(res => {
        setBlockers(res.data);
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
        <Grid item sm={4} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '35%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="report"
                    label="Blocker Details"
                    className={classes.textfield}
                    multiline
                    rows={4}
                    value={data.details}
                    onChange={e => setData({...data, details: e.target.value})}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    //multiple
                    id="admin"
                    onFocus={handleFocus}
                    options={options}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, newInput) => setData({...data, assign_to: newInput})}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Admins"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button color="primary" variant="outlined">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '45%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              {blockers.length > 0 && blockers.map(blocker => (
                <Card className={classes.root} elevation={0} key={blocker.id}>
                  <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                      {moment(blocker.createdAt).format('L')}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {blocker.details}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="text"
                      color="secondary"
                      className={classes.button}
                      startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      color="secondary"
                      className={classes.button}
                      startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      color="secondary"
                      className={classes.button}
                      startIcon={<EditIcon />}>
                      Close
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  )
}

export default Blockers;
