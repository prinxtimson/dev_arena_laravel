import React from 'react';

export const UserContext = React.createContext(null);

export const UserContextProvider = ({children}) => {
    return (
        <UserContext.Provider value={}>
            {children}
        </UserContext.Provider>
    )
}
