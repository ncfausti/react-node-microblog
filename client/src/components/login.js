import React from 'react';
import { withRouter } from 'react-router';
import AuthenticationButton from './authentication-button';
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
            this.setState({
              successMsg: 'Login was successfull.',
            });
            successDiv.style.display = 'block';
            errDiv.style.display = 'none';
          }
        },
        (error) => {
          console.log(error);
        },
      );
  }

  render() {
    // const { user } = this.props.auth0;
    // const { name, picture, email } = user;
    return (
      <div className="root">
        <div className="topbar">
          <a id="title" href="/">MicroBlog</a>
          <div className="topbar-right">
            <AuthenticationButton />
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
              type="text"
              value={this.state.username}
              onChange={(e) => {
                this.setState({ username: e.target.value });
              }}/>
            <label>Passsword</label>
            <input
              type="password"
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}/>

            {/* <button type="submit">
            <a href="/password">Forgot your password?</a>
            <button type="submit">
              Login
            </button> */}
          </form>
        </div>
      </div>
    );
  }
}

const LoginWithRouter = withRouter(Login);
export default LoginWithRouter;
