import React from 'react';
import { getUser, loginUser, logoutUser } from './actions';
import { userReducer } from './reducers';
import { LOADING, LOAD_USER, LOGIN, LOGOUT, ON_NEW_NOTIFICATION, ON_READ_NOTIFICATION, REMOVE_ALERT } from './types';

export const UserContext = React.createContext(null);

export const UserContextProvider = ({children}) => {
    const token = localStorage.getItem('DEV-ARENA-TOKEN');

    const initialState = {
        loading: true,
        error: false,
        isAuthenticated: Boolean(token),
        user: null,
        notifications: null,
        token
    }
    const [state, dispatch] = React.useReducer(userReducer, initialState);

    const login = (data) => {
        dispatch({type: LOADING});
        loginUser(data).then(res => dispatch({type: LOGIN, payload: res}))
            
    }

    const logout = () => {
        logoutUser().then(res => dispatch({type: LOGOUT, payload: res}));
    }

    const onNotificationRead = (notifications) => {
       // console.log(notifications)
        dispatch({type: ON_READ_NOTIFICATION, payload: notifications});
    }

    const onNewNotification = (notification) => {
        dispatch({type: ON_NEW_NOTIFICATION, payload: notification})
    }

    const updateUser = user => {
        dispatch({type: LOAD_USER, payload: user})
    }

    React.useMemo(() => {
        dispatch({type: LOADING});
        getUser().then(res => {
            dispatch({type: LOAD_USER, payload: res})
            console.log(res)
        });

    }, [])

    
        Echo.private(`App.Models.User.${state.user && state.user.id}`)
        .notification((notification) => {
          //
          console.log(notification)
          const newNotification = {
            data: notification,
            type: notification.type,
            id: notification.id
          }  
          dispatch({type: ON_NEW_NOTIFICATION, payload: newNotification})
        //   setNotifications({
        //     notifications: [newNotification, ...notifications.notifications],
        //     count: notifications.count + 1,
        //   })
        });

    const clearError = () => {
        dispatch({type: REMOVE_ALERT});
    }

    return (
        <UserContext.Provider
            value={{
                state,
                login,
                logout,
                clearError,
                onNotificationRead,
                onNewNotification,
                updateUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
