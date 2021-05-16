import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import { UserContextProvider } from './context/GlobalState';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import Dashboard from './screens/Dashboard';
import ForgotPassPage from './screens/ForgotPassPage';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import ResetPassPage from './screens/ResetPassPage';

const theme = createMuiTheme({
    overrides: {
      MuiCssBaseline: {
        '@global': {
          html: {
            backgroundColor: 'white',
          },
        },
      },
      MuiButton: {
        text: {
          color: 'white'
        }
      }
    },
    typography: {
      button: {
        textTransform: "none",
        color: 'white',
      }
    },
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#c7a936',
        text: 'white'
      },
    },    
  })

const App = () => {
    
    return (
        <MuiThemeProvider theme={theme}>
            <UserContextProvider>
                <Router>
                    <Switch>
                        <Route exact path="/">
                            <HomePage />
                        </Route>
                        <Route path="/dashboard/:routeName">
                            <Dashboard />
                        </Route>
                        <Route path="/dashboard">
                            <Dashboard />
                        </Route>
                        <Route path="/forgot-password">
                            <ForgotPassPage />
                        </Route>
                        <Route path="/reset-password/:token">
                            <ResetPassPage />
                        </Route>
                        <Route path="/login" exact>
                            <LoginPage />
                        </Route> 
                    </Switch>
                </Router>
            </UserContextProvider>
        </MuiThemeProvider>
    )
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}