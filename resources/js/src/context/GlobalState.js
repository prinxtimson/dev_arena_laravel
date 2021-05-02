import React from 'react';
import { getUser, loginUser } from './actions';
import { userReducer } from './reducers';
import { LOADING, LOAD_USER, LOGIN, REMOVE_ALERT } from './types';

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

    const loadUser = user => {
        dispatch({type: LOADING});
        getUser(user).then(res => dispatch({type: LOAD_USER, payload: res}));
    }

    const clearError = () => {
        dispatch({type: REMOVE_ALERT});
    }

    return (
        <UserContext.Provider
            value={{
                state,
                login,
                loadUser,
                clearError
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
