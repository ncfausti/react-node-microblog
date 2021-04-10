import React from 'react';
import { withRouter } from 'react-router';
import '../style/login.css';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      nickname: '',
      errMsg: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5001/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        nickname: this.state.nickname,
      }),
    }).then((res) => res.json())
      .then(
        (result) => {
          if (result.status != 'ok') {
            this.setState({
              errMsg: result.msg,
            });
            const errDiv = document.getElementById('errMsg');
            errDiv.style.display = 'block';
          } else {
            this.props.history.push({
              pathname: '/login',
              state: {
                msg: '✔ Registration was successful. Please login using your crendentials.',
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
            <a id="login" href="/login">Login</a>
            <a id="signup-active" href="/register">Signup</a>
          </div>
        </div>
        <div id="errMsg">
          <span>{this.state.errMsg}</span>
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
            <label>Email</label>
            <input
              type="text"
              placeholder="Optional"
              value={this.state.email}
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}/>
            <label>Nickname</label>
            <input
              type="text"
              placeholder="Optional"
              value={this.state.nickname}
              onChange={(e) => {
                this.setState({ nickname: e.target.value });
              }}/>
            <button type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const RegisterWithRouter = withRouter(Register);
export default RegisterWithRouter;
