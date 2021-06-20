import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import PeopleIcon from '@material-ui/icons/People';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { green, red, blue, purple, orange } from '@material-ui/core/colors';
import AppContainer from './AppContainer';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
    btnContainer: {
      margin: theme.spacing(2.5, 0),
      display: 'flex',
      justifyContent: 'space-between'
    },
    grid: {
        margin: theme.spacing(1, 0)
    },
    card: {
        borderRadius: 15,
    },
    green: {
        backgroundColor: 'green',
        color: 'white'
    },
    hover: {
        '&:hover': {
            color: '#fff',
        }
    }
}));

const AdminDashboard = () => {
  const classes = useStyles();
  const [summary, setSummary] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
      axios.get(`${BASE_URL}/api/summary`)
          .then(res => {
              console.log(res.data);
              setSummary(res.data);
              setLoading(false);
          })
          .catch(err => {
              console.log(err.response);
              if (err.response.statusText === "Unauthorized") {
                  location.replace('/login');
              }
              setLoading(false);
          });
  }, []);

  return (
          <Grid container spacing={3}>
          {loading ? Array.from(new Array(3)).map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                  <Skeleton variant="rect" width="100%" height={150} />
              </Grid>
          )) : (
           <>
              <Grid item xs={12} sm={4}>
                  <Card elevation={5} className={classes.card}>
                      <CardContent>
                          <Grid
                              container
                              spacing={3}
                              style={{ justifyContent: 'space-between' }}
                          >
                              <Grid item>
                                  <Typography
                                      color="textPrimary"
                                      variant="h6"
                                  >
                                      Total Projects
                                  </Typography>
                                  <Typography
                                      color="textPrimary"
                                      variant="h3"
                                  >
                                      {summary?.total_projects}
                                  </Typography>
                              </Grid>
                              <Grid item>
                                  <Avatar
                                      style={{
                                      backgroundColor: purple[600],
                                      height: 56,
                                      width: 56
                                      }}
                                  >
                                      <BusinessCenterIcon />
                                  </Avatar>
                              </Grid>
                          </Grid>
                      </CardContent>
                  </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                  <Card elevation={5} className={classes.card}>
                      <CardContent>
                          <Grid
                              container
                              spacing={3}
                              style={{ justifyContent: 'space-between' }}
                          >
                              <Grid item>
                                  <Typography
                                      color="textPrimary"
                                      variant="h6"
                                  >
                                      Total Users
                                  </Typography>
                                  <Typography
                                      color="textPrimary"
                                      variant="h3"
                                  >
                                      {summary?.users}
                                  </Typography>
                              </Grid>
                              <Grid item>
                                  <Avatar
                                      style={{
                                      backgroundColor: green[600],
                                      height: 56,
                                      width: 56
                                      }}
                                  >
                                      <PeopleIcon />
                                  </Avatar>
                              </Grid>
                          </Grid>
                      </CardContent>
                  </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                  <Card elevation={5} className={classes.card}>
                      <CardContent>
                          <Grid
                              container
                              spacing={3}
                              style={{ justifyContent: 'space-between' }}
                          >
                              <Grid item>
                                  <Typography
                                      color="textPrimary"
                                      variant="h6"
                                  >
                                      Projects In-Progress  
                                  </Typography>
                                  <Typography
                                      color="textPrimary"
                                      variant="h3"
                                  >
                                      {summary?.in_progress_projects}
                                  </Typography>
                              </Grid>
                              <Grid item>
                                  <Avatar
                                      style={{
                                      backgroundColor: orange[600],
                                      height: 56,
                                      width: 56
                                      }}
                                  >
                                      <BusinessCenterIcon />
                                  </Avatar>
                              </Grid>
                          </Grid>
                      </CardContent>
                  </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                  <Card elevation={5} className={classes.card}>
                      <CardContent>
                          <Grid
                              container
                              spacing={3}
                              style={{ justifyContent: 'space-between' }}
                          >
                              <Grid item>
                                  <Typography
                                      color="textPrimary"
                                      variant="h6"
                                  >
                                      Projects Completed
                                  </Typography>
                                  <Typography
                                      color="textPrimary"
                                      variant="h3"
                                  >
                                      {summary?.completed_projects}
                                  </Typography>
                              </Grid>
                              <Grid item>
                                  <Avatar
                                      style={{
                                      backgroundColor: blue[600],
                                      height: 56,
                                      width: 56
                                      }}
                                  >
                                      <BusinessCenterIcon />
                                  </Avatar>
                              </Grid>
                          </Grid>
                      </CardContent>
                  </Card>
              </Grid>
              </>
            )}
          </Grid>
  )
}

export default AdminDashboard;
