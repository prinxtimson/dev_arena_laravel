import React from 'react';
import { getUser, loginUser, logoutUser } from './actions';
import { userReducer } from './reducers';
import { LOADING, LOAD_USER, LOGIN, LOGOUT, REMOVE_ALERT } from './types';

export const UserContext = React.createContext(null);

export const UserContextProvider = ({children}) => {
    const initialState = {
        loading: false,
        error: false,
        isAuthenticated: false
    }
    const [state, dispatch] = React.useReducer(userReducer, initialState);

    const login = (data) => {
        dispatch({type: LOADING});
        loginUser(data).then(res => dispatch({type: LOGIN, payload: res}));  
    }

    const logout = () => {
        logoutUser().then(res => dispatch({type: LOGOUT, payload: res}));
    }

    React.useEffect(() => {
        dispatch({type: LOADING});
        getUser().then(res => dispatch({type: LOAD_USER, payload: res}));
    }, [])

    const clearError = () => {
        dispatch({type: REMOVE_ALERT});
    }

    return (
        <UserContext.Provider
            value={{
                state,
                login,
                logout,
                clearError
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
