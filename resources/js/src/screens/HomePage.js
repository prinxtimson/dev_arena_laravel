import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import AppNavBar from '../components/AppNavBar';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      margint: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

function HomePage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppNavBar />
            <Container>
                <p>Home page</p>
            </Container>
        </div>
    )
}

export default HomePage;
