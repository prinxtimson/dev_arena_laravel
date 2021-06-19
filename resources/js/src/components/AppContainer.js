import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import MainFooter from './MainFooter';
import {useLocation} from "react-router-dom";

const HEIGHT = window.innerHeight;

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: 'whitesmoke',
        minHeight: HEIGHT,
    },
    container2: {
        backgroundColor: 'white',
    },
    innerContainer: {
        margin: theme.spacing(5, 0),
        display: 'flex',
        flexDirection: 'column',
        //justifyContent: 'center'
    }
  }));
 
function AppContainer({children}) {
    const classes = useStyles();
    let location = useLocation();

    return (
        <div className={location.pathname === '/login' ? classes.container2 : classes.container}>     
            <CssBaseline />
            {children}
            <MainFooter />
        </div>
    )
}

export default AppContainer;
