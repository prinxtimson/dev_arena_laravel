import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { UserContext } from '../context/GlobalState';

const AuthRoute = ({component: Component, ...rest}) => {
    const context = React.useContext(UserContext);
    
    return (
        <Route
            {...rest}
            render={(props) => 
                context.state.isAuthenticated ? <Redirect to='/dashboard' /> : <Component {...props} />
            }
        />
    )
}

export default AuthRoute;
