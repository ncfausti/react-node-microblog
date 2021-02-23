import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Register from './components/register'
import Login from './components/login'

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
          </Switch>
        </Router>
      </div>
    );
  }
}