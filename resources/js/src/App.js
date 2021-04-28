import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Dashboard from './screens/Dashboard';
import ForgotPassPage from './screens/ForgotPassPage';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import ResetPassPage from './screens/ResetPassPage';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/forgot-password">
                    <ForgotPassPage />
                </Route>
                <Route path="/reset-password">
                    <ResetPassPage />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
            </Switch>
        </Router>
    )
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}