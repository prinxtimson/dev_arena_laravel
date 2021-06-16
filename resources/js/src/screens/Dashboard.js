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
import UserProfile from '../components/UserProfile';
import ProjectsTable from '../components/ProjectsTable';
import AddProjectForm from '../components/AddProjectForm';
import SingleProject from '../components/SingleProject';
import AddResourceForm from '../components/AddResourceForm';
import Resources from '../components/Resources';
import SingleResource from '../components/SingleResource';
import UserProjects from '../components/UserProjects';

const useStyles = makeStyles((theme) => ({

  }));

function Dashboard({match}) {
    const classes = useStyles();
    const {routeName, id} = useParams();
    const {state} = React.useContext(UserContext);
    

    const renderComponent = (param1, param2) => {
        switch(param1) {
            case 'users':
                return <UsersTable />;
            case 'projects':
                if(param2){
                    return <SingleProject />;
                } else if (state.user?.roles[0]?.name === 'developer') {
                    return <UserProjects projects={state.user.projects} />;
                }else {
                    return <ProjectsTable />;
                }
            case 'resources':
                if(param2){
                    return <SingleResource />;
                }
                return <Resources />;
            case 'change-password':
                return <ChangePasswordForm />;
            case 'add-user':
                return <AddUserForm />;
            case 'profile':
                if(param2){
                    return <UserProfile /> 
                }else {
                    return <Profile />
                };
            case 'add-project':
                return <AddProjectForm />
            case 'add-resources':
                return <AddResourceForm />;
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
            {renderComponent(routeName, id)}
        </DrawerMenu>
    )
}

export default Dashboard;
