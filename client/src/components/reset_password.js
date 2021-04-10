import React from 'react';
import { withRouter } from 'react-router';
import '../style/login.css';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      repeatedPsw: '',
      errMsg: '',
      successMsg: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const errDiv = document.getElementById('errMsg');
    if (this.state.password != this.state.repeatedPsw) {
      this.setState({
        errMsg: 'Your passwords do not match!',
      });
      errDiv.style.display = 'block';
      return;
    }
    fetch(`http://localhost:5001/user/${this.state.username}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    }).then((res) => res.json())
      .then(
        (result) => {
          if (result.status != 'ok') {
            this.setState({
              errMsg: result.msg,
            });
            errDiv.style.display = 'block';
          } else {
            this.props.history.push({
              pathname: '/login',
              state: {
                msg: '✔ Password reset was successful. Please login using your crendentials.',
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
            <a id="signup" href="/register">Signup</a>
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
            <label>Verify Your Email Address:</label>
            <input
              type="text"
              value={this.state.email}
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}/>
            <label>Reset Your Passsword:</label>
            <input
              type="password"
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}/>
            <label>Repeat Your Passsword:</label>
            <input
              type="password"
              value={this.state.repeatedPsw}
              onChange={(e) => {
                this.setState({ repeatedPsw: e.target.value });
              }}/>
            <button type="submit">
              Reset Your Password
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(ResetPassword);
