import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import DrawerMenu from '../components/DrawerMenu';
import UsersTable from '../components/UsersTable';
import ChangePasswordForm from '../components/ChangePasswordForm';
import AddUserForm from '../components/AddUserForm';
import DashboardIndex from '../components/DashboardIndex';
import { UserContext } from '../context/GlobalState';
import InfoDialog from '../components/InfoDialog';
import Profile from '../components/Profile';

const useStyles = makeStyles((theme) => ({

  }));

function Dashboard({match}) {
    const classes = useStyles();
    const {routeName} = useParams();
    const {state} = React.useContext(UserContext);
    

    const renderComponent = (param) => {
        switch(param) {
            case 'users':
                return <UsersTable />
            case 'change-password':
                return <ChangePasswordForm />;
            case 'add-user':
                return <AddUserForm />;
            case 'profile':
                return <Profile />;
            default:
                return <DashboardIndex />;
        }
    }

    return (
        <DrawerMenu>
            <CssBaseline />
            {!state.loading && (
                <InfoDialog email_verified_at={state.user && state.user.email_verified_at} />
            )}
            {renderComponent(routeName)}
        </DrawerMenu>
    )
}

export default Dashboard;
