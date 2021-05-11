import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import { withAuth0 } from '@auth0/auth0-react';
import Register from './components/register';
import Login from './components/login';
import Messaging from './components/messaging';
import ResetPassword from './components/reset_password';
import Home from './components/home';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Login />
              )}
            />
            <Route
              exact
              path="/home"
              render={() => (
                <Home />
              )}
            />
            <Route
              exact
              path="/register"
              render={() => (
                <Register />
              )}
            />
            <Route
              exact
              path="/login"
              render={() => (
                <Login />
              )}
            />
            <Route
              exact
              path="/messaging"
              render={() => (
                <Messaging />
              )}
            />
            <Route
              exact
              path="/password"
              render={() => (
                <ResetPassword />
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
export default withAuth0(App);
