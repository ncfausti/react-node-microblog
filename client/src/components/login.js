import React from "react";
import { withRouter } from 'react-router'
import '../style/login.css'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errMsg: '',
      successMsg: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        successMsg: this.props.location.state.msg
      });
      var successDiv = document.getElementById("successMsg");
      successDiv.style.display = "block";
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    // TODO
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
              type="text"
              value={this.state.username}
              onChange={(e) => {this.setState({
                username: e.target.value
              })}}/>
            <label>Passsword</label>
            <input
              type="password"
              value={this.state.password}
              onChange={(e) => {this.setState({
                password: e.target.value
              })}}/>
            <button type="submit">
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