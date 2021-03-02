import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Register from './components/register'
import Login from './components/login'
import Messaging from './components/messaging'

export default class App extends React.Component {
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
          </Switch>
        </Router>
      </div>
    );
  }
}