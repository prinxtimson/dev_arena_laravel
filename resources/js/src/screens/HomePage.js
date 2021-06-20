import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import AppContainer from '../components/AppContainer';
import Container from '@material-ui/core/Container';
import AppNavBar from '../components/AppNavBar';
import {UserContext} from '../context/GlobalState';

const useStyles = makeStyles(theme => ({
    menuButton: {
      margin: theme.spacing(2, 0),
      width: '60%',
      '&:hover': {
        color: '#fff',
      }
    },
    root: {
      display: 'flex',
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh'
    },
    title: {
      flexGrow: 1,
      fontWeight: 'bold',
      color: '#530f77',
    },
  }));

function HomePage() {
    const classes = useStyles();
    const {state} = React.useContext(UserContext);

    return (
        <AppContainer>
          <AppNavBar />
          <div className={classes.root}>
            <Container component="main">
              <Grid container spacing={5} justify="center" alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="h2" component="h5" className={classes.title}>
                    Welcome to Tritek Dev Arena
                  </Typography>
                  <Typography></Typography>
                  {state.user ? null : (
                    <Button
                      color="primary"
                      className={classes.menuButton}
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/login"
                    >
                      Login
                    </Button>
                  )}
                </Grid>
                <Grid item xs={12} sm={8}>
                  <img style={{width: '100%'}} src="/images/development.svg" alt="Development" />
                </Grid>
              </Grid>
            </Container>
          </div>
        </AppContainer>
    )
}

export default HomePage;
