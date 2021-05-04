import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import DrawerMenu from '../components/DrawerMenu';
import UsersTable from '../components/UsersTable';
import ChangePasswordForm from '../components/ChangePasswordForm';
import AddUserForm from '../components/AddUserForm';

const useStyles = makeStyles((theme) => ({

  }));

function Dashboard({match}) {
    const classes = useStyles();
    const {routeName} = useParams() ;

    const renderComponent = (param) => {
        switch(param) {
            case 'users':
                return <UsersTable />;
            case 'change_password':
                return <ChangePasswordForm />;
            case 'add_user':
                return <AddUserForm />;
            default:
                return;
        }
    }

    return (
        <DrawerMenu>
            <CssBaseline />
            {renderComponent(routeName)}
        </DrawerMenu>
    )
}

export default Dashboard;
