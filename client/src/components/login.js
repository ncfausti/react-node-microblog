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
      let successDiv = document.getElementById("successMsg");
      successDiv.style.display = "block";
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5001/login",
		{
			method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
		}).then(res => res.json())
    .then(
      (result) => {
        let errDiv = document.getElementById("errMsg");
        let successDiv = document.getElementById("successMsg");
        if (result.status != "ok") {
          this.setState({
            errMsg: result.msg
          });
          successDiv.style.display = "none";
          errDiv.style.display = "block";
        } else {
          this.setState({
            successMsg: result.msg
          });
          successDiv.style.display = "block";
          errDiv.style.display = "none";
        }
      },
      (error) => {
        console.log(error);
      }
    )
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