import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';

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
            <AppBar position="static" elevation={0} color="inherit">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Dev Arena
                    </Typography>
                    <Button 
                        color="primary"
                        variant="outlined"
                        component={Link}
                        to="/login"
                    >
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <p>Home page</p>
            </Container>
        </div>
    )
}

export default HomePage;
