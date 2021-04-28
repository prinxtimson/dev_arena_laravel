import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import DrawerMenu from '../components/DrawerMenu';

const useStyles = makeStyles((theme) => ({

  }));

function Dashboard() {
    const classes = useStyles();

    return (
        <DrawerMenu>
            <CssBaseline />
            
        </DrawerMenu>
    )
}

export default Dashboard;
