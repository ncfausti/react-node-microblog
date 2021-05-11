import React from 'react';
import { withRouter } from 'react-router';
import '../style/login.css';
import Agent from './fetches';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errMsg: '',
      successMsg: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        successMsg: this.props.location.state.msg,
      });
      const successDiv = document.getElementById('successMsg');
      successDiv.style.display = 'block';
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    Agent.login(this.state.username, this.state.password)
      .then(
        (result) => {
          const errDiv = document.getElementById('errMsg');
          const successDiv = document.getElementById('successMsg');
          if (result.status != 'ok') {
            this.setState({
              errMsg: result.msg,
            });
            successDiv.style.display = 'none';
            errDiv.style.display = 'block';
          } else {
            // this.setState({
            //   successMsg: 'Login was successfull.',
            // });
            // successDiv.style.display = 'block';
            // errDiv.style.display = 'none';
            this.props.history.push({
              pathname: '/home',
              state: {
                username: this.state.username,
              },
            });
          }
        },
        (error) => {
          console.log(error);
        },
      );
  }

  render() {
    return (
      <div className="root">
        <div className="topbar">
          <a id="title" href="/">MicroBlog</a>
          <div className="topbar-right">
            <a id="login-active" href="/login">Login</a>
            <a id="signup" href="/register">Signup</a>
          </div>
        </div>
        <div id="errMsg">
          <span>{this.state.errMsg}</span>
        </div>
        <div id="successMsg">
          <span>{this.state.successMsg}</span>
        </div>
        <div className="register">
          <form onSubmit={this.handleSubmit}>
            <label>Username</label>
            <input
              id="username"
              type="text"
              value={this.state.username}
              onChange={(e) => {
                this.setState({ username: e.target.value });
              }} />
            <label>Passsword</label>
            <input
              id="password"
              type="password"
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }} />
            <a href="/password">Forgot your password?</a>
            <button type="submit" id={'submit'}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const LoginWithRouter = withRouter(Login);
export default LoginWithRouter;
