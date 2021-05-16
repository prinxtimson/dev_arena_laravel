import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import MainFooter from './MainFooter';

const HEIGHT = window.innerHeight;

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: HEIGHT,
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
        <div className="container-fluid">
            <CssBaseline />
            {children}
            <MainFooter />
        </div>
    )
}

export default AppContainer;
