import React from 'react';
import AppContainer from './AppContainer';
import { UserContext } from '../context/GlobalState';
import DevDashboard from './DevDashboard';
import AdminDashboard from './AdminDashboard';


const DashboardIndex = () => {
    const {state, loading} = React.useContext(UserContext);

    return (
        <AppContainer>
            {loading ? null : state.user?.roles[0].name === 'developer' ? (
                <DevDashboard />
            ) : (
                <AdminDashboard />
            )}
        </AppContainer>
    )
}

export default DashboardIndex;
