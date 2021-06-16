import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import ListItemText from '@material-ui/core/ListItemText';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
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
  const [state, setState] = React.useState({
    reports: false,
    issues: false,
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

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleOnExport = () => {
    window.location.href = `${BASE_URL}/projects/export/${id}?report=${state.reports}&blocker=${state.issues}`
  }

  return (
    <div className={classes.root} >
      <Grid container spacing={3}>
        <Grid item sm={4} xs={12}>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '35%' }} />
            </Skeleton>
          ) : (
            <Paper className={classes.paper}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.reports}
                          onChange={handleChange}
                          name="reports"
                          color="primary"
                        />
                      }
                      label="Include Reports"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.issues}
                          onChange={handleChange}
                          name="issues"
                          color="primary"
                        />
                      }
                      label="Include Blockers"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleOnExport}>
                    Export Project
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
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ListItemText primary="Name" secondary={project.name} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText primary="Project PM" secondary={project.project_pm} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText primary="Project Owner" secondary={project.project_owner} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText primary="BA Lead" secondary={project.ba_lead} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText primary="Scrum Master" secondary={project.scrum_master} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText primary="Dev Liason Officer" secondary={project.dev_liason_officer} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="Developer"
                    secondary={project.developers.length > 0 && project.developers.map(dev => dev.name).join(', ')} />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="Start Date"
                    secondary={moment(project.start_at).format('MMM Do YYYY')} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="Estimated End"
                    secondary={moment(project.est_end_at).format('MMM Do YYYY')}/>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    primary="End"
                    secondary={moment(project.end_at).format('MMM Do YYYY')}/>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default ProjectDetails;
