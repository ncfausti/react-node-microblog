import React from 'react';
import '../style/messaging.css';

class Messaging extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: 'Andrew',
      username: 'andrew2021_group',
    };
  }

  render() {
    return (
      <div className="messaging">

        <div id="title-bar">
          <div className="names">
            <span className="nickname">{this.state.nickname}</span><br />
            <span className="username">{this.state.username}</span>
          </div>
          <div className="img">
            <img className="icon" alt="info" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDMzMCAzMzAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMzMCAzMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0xNjUsMC4wMDhDNzQuMDE5LDAuMDA4LDAsNzQuMDI0LDAsMTY0Ljk5OWMwLDkwLjk3Nyw3NC4wMTksMTY0Ljk5MiwxNjUsMTY0Ljk5MnMxNjUtNzQuMDE1LDE2NS0xNjQuOTkyDQoJCQkJQzMzMCw3NC4wMjQsMjU1Ljk4MSwwLjAwOCwxNjUsMC4wMDh6IE0xNjUsMjk5Ljk5MmMtNzQuNDM5LDAtMTM1LTYwLjU1Ny0xMzUtMTM0Ljk5MlM5MC41NjEsMzAuMDA4LDE2NSwzMC4wMDgNCgkJCQlzMTM1LDYwLjU1NywxMzUsMTM0Ljk5MUMzMDAsMjM5LjQzNiwyMzkuNDM5LDI5OS45OTIsMTY1LDI5OS45OTJ6Ii8+DQoJCQk8cGF0aCBkPSJNMTY1LDEzMC4wMDhjLTguMjg0LDAtMTUsNi43MTYtMTUsMTV2OTkuOTgzYzAsOC4yODQsNi43MTYsMTUsMTUsMTVzMTUtNi43MTYsMTUtMTV2LTk5Ljk4Mw0KCQkJCUMxODAsMTM2LjcyNSwxNzMuMjg0LDEzMC4wMDgsMTY1LDEzMC4wMDh6Ii8+DQoJCQk8cGF0aCBkPSJNMTY1LDcwLjAxMWMtMy45NSwwLTcuODExLDEuNi0xMC42MSw0LjM5Yy0yLjc5LDIuNzktNC4zOSw2LjY2LTQuMzksMTAuNjFzMS42LDcuODEsNC4zOSwxMC42MQ0KCQkJCWMyLjc5LDIuNzksNi42Niw0LjM5LDEwLjYxLDQuMzlzNy44MS0xLjYsMTAuNjA5LTQuMzljMi43OS0yLjgsNC4zOTEtNi42Niw0LjM5MS0xMC42MXMtMS42MDEtNy44Mi00LjM5MS0xMC42MQ0KCQkJCUMxNzIuODEsNzEuNjEsMTY4Ljk1LDcwLjAxMSwxNjUsNzAuMDExeiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" />
          </div>
        </div>

        <div className="container">
          <img src="https://www.flaticon.com/premium-icon/icons/svg/2202/2202112.svg" alt="Avatar"></img>
          <p>Hey! I was wondering if you could help me change the destination
             of a recent order I placed?</p>
          <span className="time-right">11:00</span>
        </div>

        <div className="container mine">
          <img src="https://www.flaticon.com/premium-icon/icons/svg/3001/3001764.svg" alt="Avatar" className="right">
          </img>
          <p>@Andrew I&apos;d be happy to help you! Please click the link below to start
             a private conversation? I&apos;ll need your order number to start.</p>
          <span className="time-left">11:01</span>
        </div>

        <div className="container">
          <img src="https://www.flaticon.com/premium-icon/icons/svg/2202/2202112.svg" alt="Avatar"></img>
          <p>Sweet! So great seeing you today at the picnic!</p>
          <span className="time-right">11:02</span>
        </div>

        <div className="container mine">
          <img src="https://www.flaticon.com/premium-icon/icons/svg/3001/3001764.svg" alt="Avatar" className="right"></img>
          <p>I was in the bouncy. Also tell me if you get an invitation on the calender now.</p>
          <span className="time-left">11:05</span>
        </div>

        <div className="inputbox">
          <input type="text" placeholder="Start a new message"></input>
          <img alt="send" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzREQkJFQjsiIGQ9Ik01MDcuNjA3LDQuMzk1Yy00LjI0Mi00LjI0NS0xMC42MS01LjU1MS0xNi4xNzctMy4zMmwtNDgyLDE5Mi43OTgNCgljLTUuNTE2LDIuMjA1LTkuMjA5LDcuNDU4LTkuNDIsMTMuMzk0Yy0wLjIxMSw1LjkzNiwzLjEwMSwxMS40MzgsOC40NDQsMTQuMDI5bDE5MC4wNjcsOTIuMTgybDkyLjE4MiwxOTAuMDY4DQoJYzIuNTE0LDUuMTg0LDcuNzY0LDguNDU0LDEzLjQ5Myw4LjQ1NGMwLjE3OCwwLDAuMzU3LTAuMDAzLDAuNTM2LTAuMDFjNS45MzYtMC4yMTEsMTEuMTg4LTMuOTA0LDEzLjM5NC05LjQxOUw1MTAuOTI4LDIwLjU3Mw0KCUM1MTMuMTU2LDE1LjAwMiw1MTEuODUsOC42MzgsNTA3LjYwNyw0LjM5NXoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiMyNDg4RkY7IiBkPSJNNTA3LjYwNyw0LjM5NUwxOTguNTIyLDMxMy40NzdsOTIuMTgyLDE5MC4wNjhjMi41MTQsNS4xODQsNy43NjQsOC40NTQsMTMuNDkzLDguNDU0DQoJYzAuMTc4LDAsMC4zNTctMC4wMDMsMC41MzYtMC4wMWM1LjkzNi0wLjIxMSwxMS4xODgtMy45MDQsMTMuMzk0LTkuNDE5TDUxMC45MjgsMjAuNTczQzUxMy4xNTYsMTUuMDAyLDUxMS44NSw4LjYzOCw1MDcuNjA3LDQuMzk1DQoJTDUwNy42MDcsNC4zOTV6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==" />
        </div>
      </div>
    );
  }
}

export default Messaging;
