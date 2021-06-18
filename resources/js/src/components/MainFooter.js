import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '110px'
    }
  }));

function MainFooter() {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <CssBaseline />
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://tritekconsulting.co.uk">
                    Tritek Consulting Ltd
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </div>
    )
}

export default MainFooter;