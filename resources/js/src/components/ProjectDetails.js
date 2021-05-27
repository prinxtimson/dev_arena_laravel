import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 0),
  },
  paper: {
    padding: theme.spacing(3)
  },
}));

const ProjectDetails = ({id}) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [project, setProject] = React.useState({
    developers: []
  });

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
    <div className={classes.root} >
      <Grid container spacing={3}>
        <Grid item sm={8} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '45%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ListItemText primary="Name" secondary={project.name} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText primary="Project PM" secondary={project.project_pm} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText primary="Project Mandate" secondary={project.mandate} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="Developer"
                    secondary={project.developers.length > 0 && project.developers.map(dev => dev.name).join(', ')} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="Start"
                    secondary={moment(project.start).format('MMM Do YYYY')} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="Expected End"
                    secondary={moment(project.expected_end).format('MMM Do YYYY')}/>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="End"
                    secondary={moment(project.end).format('MMM Do YYYY')}/>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        <Grid item sm={4} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '35%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
            <ListItemText
                  primary="End"
                  secondary={moment(project.end).format('MMM Do YYYY')}/>
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default ProjectDetails;
