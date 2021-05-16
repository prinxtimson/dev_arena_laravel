import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import {UserContext} from '../context/GlobalState';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      padding: theme.spacing(0, 2.5),
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
    },
}));

const AppNavBar = () => {
    const classes = useStyles();
    const {state, logout} = React.useContext(UserContext)
    return (
            <AppBar position="static" elevation={0} color="inherit">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Dev Arena
                    </Typography>
                    {state.user ? (
                        <div>
                             <Button 
                                color="primary"
                                className={classes.menuButton}
                                variant="text"
                                component={Link}
                                to="/dashboard"
                            >
                                Dashboard
                            </Button>
                            <Button 
                                color="primary"
                                className={classes.menuButton}
                                variant="contained"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            color="primary"
                            className={classes.menuButton}
                            variant="outlined"
                            size="large"
                            component={Link}
                            to="/login"
                        >
                            Login
                        </Button>
                    )}  
                </Toolbar>
            </AppBar>
    )
}

export default AppNavBar;