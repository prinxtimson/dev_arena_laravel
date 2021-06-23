import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
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
      marginRight: theme.spacing(2),
      '&:hover': {
        color: '#c7a936',
        }
    },
    menuButton2: {
        padding: theme.spacing(0, 2.5),
        marginRight: theme.spacing(2),
        '&:hover': {
          color: '#fff',
          }
      },
    title: {
      flexGrow: 1,
    },
    image: {
        width: 85,
        height: 42,
    },
    logo: {
        [theme.breakpoints.up('md')]: {
            width: '12rem',
            height: '5%',
        },
        [theme.breakpoints.down('md')]: {
            width: '10rem',
            height: '5%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '8rem',
            height: '5%',
        },
    }
}));

const AppNavBar = () => {
    const classes = useStyles();
    const {state, logout} = React.useContext(UserContext)
    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={0} color="inherit" style={{padding: 10}}>
                <Toolbar>
                <div className={classes.title}>
                    <Avatar className={classes.logo} variant="square" alt="Dev Arena" src="/images/logo.png" >
                        Dev Arena
                    </Avatar>
                </div>
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
                                className={classes.menuButton2}
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
                            component={Link}
                            to="/login"
                        >
                            Login
                        </Button>
                    )}  
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default AppNavBar;