import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import MainFooter from './MainFooter';

const HEIGHT = window.innerHeight;

const useStyles = makeStyles((theme) => ({
    container: {
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

    return (
        <div className={[classes.container]}>     
            <CssBaseline />
            {children}
            <MainFooter />
        </div>
    )
}

export default AppContainer;
