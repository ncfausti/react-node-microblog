import React from 'react';
import { withRouter } from 'react-router';
import '../style/home.css';
import FollowingContact from './home/following_contact';
import BlockingContact from './home/blocking_contact';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      nickname: '',
      email: '',
      summary: '',
      avatar_ref: '',
      following: [],
      blocking: [],
    };

    this.handleResetPsw = this.handleResetPsw.bind(this);
    this.handleDeactivate = this.handleDeactivate.bind(this);
  }

  componentDidMount() {
    const followingList = [{ username: 'user132' }, { username: 'user22234' }];
    const followingDivs = followingList.map(
      (followingObject, i) => <FollowingContact key={i} username={followingObject.username} />,
    );
    const blockingList = [{ username: 'user456' }, { username: 'user84634' }];
    const blockingDivs = blockingList.map(
      (blockingObject, i) => <BlockingContact key={i} username={blockingObject.username} />,
    );
    this.setState({
      username: 'feng3116',
      nickname: 'Feng',
      email: 'feng@test.com',
      summary: 'Hey there!',
      avatar_ref: 'data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PGc+PGc+PHBhdGggZD0ibTI1Ni4wMjUgNDgzLjMzNCAxMDEuNDI5LTI1LjYxNGM1Ny44OTUtNDguMDc0IDk0Ljc3MS0xMjAuNTg2IDk0Ljc3MS0yMDEuNzE5IDAtMTI1LjE0NC04Ny43MTEtMjI5LjgwMS0yMDUuMDEyLTI1NS44NTItMTM3LjMxNiA0LjYzMS0yNDcuMjEzIDExNy40MDctMjQ3LjIxMyAyNTUuODUxIDAgNzEuMTEyIDI5IDEzNS40NDYgNzUuODEyIDE4MS44MzZ6IiBmaWxsPSIjY2JlMmZmIi8+PC9nPjxnPjxwYXRoIGQ9Im00NDYuOTE0IDI1NmMwIDgzLjkxNS00MC4zODEgMTU4LjM5MS0xMDIuNzY1IDIwNS4wNzlsOTIuMDMxLTIzLjI0MWM0Ni44MTUtNDYuMzkgNzUuODItMTEwLjcyNCA3NS44Mi0xODEuODM4IDAtMTQxLjM4NS0xMTQuNjE1LTI1Ni0yNTYtMjU2LTExLjAyNCAwLTIxLjg4Ni42OTgtMzIuNTQzIDIuMDUgMTI2LjAxOSAxNS45ODggMjIzLjQ1NyAxMjMuNTkgMjIzLjQ1NyAyNTMuOTV6IiBmaWxsPSIjYmVkOGZiIi8+PC9nPjxnPjxnPjxnPjxwYXRoIGQ9Im0zMTkuNjIxIDk2Ljk1MmMwLTEzLjA3NS0xMC41OTktMjMuNjc0LTIzLjY3NC0yMy42NzRoLTgxLjU4MmMtMzAuMDkxIDAtNTQuNDg1IDI0LjM5NC01NC40ODUgNTQuNDg1djYwLjQ5M2gxOTIuMjA5di01OS42MzVjMC0xMy4wNzUtMTAuNTk5LTIzLjY3NC0yMy42NzQtMjMuNjc0aC0uNzk4Yy00LjQxNiAwLTcuOTk2LTMuNTc5LTcuOTk2LTcuOTk1eiIgZmlsbD0iIzM2NWU3ZCIvPjxwYXRoIGQ9Im0zMjguNDE1IDEwNC45NDdoLS43OThjLTQuNDE2IDAtNy45OTYtMy41OC03Ljk5Ni03Ljk5NiAwLTEzLjA3NS0xMC41OTktMjMuNjc0LTIzLjY3NC0yMy42NzRoLTguOTQ1djExNC45NzhoNjUuMDg2di01OS42MzVjLjAwMS0xMy4wNzMtMTAuNTk5LTIzLjY3My0yMy42NzMtMjMuNjczeiIgZmlsbD0iIzJiNGQ2NiIvPjxwYXRoIGQ9Im00MjUuMDQ1IDM3Mi4zNTVjLTYuMjU5LTYuMTgyLTE0LjAwMS0xMC45NjMtMjIuNzktMTMuNzQ1bC02OS44OTEtMjIuMTI4LTc2LjM0OC0yLjY4My03Ni4zOCAyLjY4My02OS44OTEgMjIuMTI4Yy0yMy42NDQgNy40ODYtMzkuNzEzIDI5LjQyOC0zOS43MTMgNTQuMjI5djE5LjA5NGM0NC43ODkgNDcuMzI4IDEwNy40NTEgNzcuNTY4IDE3Ny4xODMgNzkuOTIgNzguMTI4LTE3LjM1MyAxNDMuMTI5LTY5LjU3NiAxNzcuODMtMTM5LjQ5OHoiIGZpbGw9IiM0YTgwYWEiLz48cGF0aCBkPSJtNDQxLjk2OCA0MzEuOTMydi0xOS4wOTRjMC0xNy41MzYtOC4wNC0zMy42MzUtMjEuMTA1LTQ0LjIxMy0zNy4xMTEgNzUuNjI2LTExMC40MjIgMTMwLjI2OC0xOTcuMzQ2IDE0MS4zMTcgMTAuNDkyIDEuMzI5IDIxLjE3OCAyLjAzOCAzMi4wMjYgMi4wNTcgMTAuNDIzLS4wMTYgMjAuNzA4LS42MiAzMC44MjQtMS43ODIgNjEuMDMxLTcuMjEyIDExNS40ODUtMzUuODk0IDE1NS42MDEtNzguMjg1eiIgZmlsbD0iIzQwNzA5MyIvPjxwYXRoIGQ9Im0yNjEuNzk2IDUwOC4xNjhjMTUuNDg5LTMwLjc1MSA1NS44MjItMTE4LjA2NyA0NC4zMjEtMTcyLjYwOWwtNTAuMTAxLTE5LjQ5OS01MC4xNDggMTkuNWMtMTEuODU2IDU2LjIyNSAzMS4zNyAxNDcuMjc3IDQ1LjY4MSAxNzUuMjkgMy40NDItLjgyNiA2Ljg1OS0xLjcyMSAxMC4yNDctMi42ODJ6IiBmaWxsPSIjZTRmNmZmIi8+PHBhdGggZD0ibTI4OC4xOTcgNDgzLjc4OS0yMC4zMTQtNzkuOTE3aC0yMy43NjdsLTIwLjI2NCA3OS42OTkgMjUuMDU4IDI3Ljg5N2M2LjM2MS0xLjQ1NyAxMi42MzQtMy4xNDYgMTguODEtNS4wNTd6IiBmaWxsPSIjZTI4MDg2Ii8+PHBhdGggZD0ibTI0OS4zMDIgNTExLjkwNWMyLjA3NS4wNTQgNC4xNTQuMDkxIDYuMjQxLjA5NSAyLjQxNS0uMDA0IDQuODIyLS4wNDYgNy4yMjItLjExM2wxMi45MDctMTQuMjU5Yy0xMC4xNTkgMy41NjQtMjAuNjEgNi41MDYtMzEuMzA5IDguNzc5eiIgZmlsbD0iI2RkNjM2ZSIvPjxnPjxnPjxnPjxnPjxnPjxnPjxnPjxnPjxwYXRoIGQ9Im0yOTguNzc0IDMyOC4xODN2LTQ1LjA2NmgtODUuNTh2NDUuMDY2YzAgMjMuNjMyIDQyLjc5IDQ5LjQ0NiA0Mi43OSA0OS40NDZzNDIuNzktMjUuODE0IDQyLjc5LTQ5LjQ0NnoiIGZpbGw9IiNmZmRkY2UiLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PHBhdGggZD0ibTM1Mi4wODkgMTgwLjMxOGgtMTYuMzU5Yy05LjA5OCAwLTE2LjQ3My03LjM3NS0xNi40NzMtMTYuNDczdi05LjAxNWMwLTExLjg1MS0xMS41OTUtMjAuMjMtMjIuODQ3LTE2LjUxMS0yNi4yNDMgOC42NzQtNTQuNTc5IDguNjc2LTgwLjgyMy4wMDZsLS4wMzEtLjAxYy0xMS4yNTItMy43MTctMjIuODQ1IDQuNjYyLTIyLjg0NSAxNi41MTJ2OS4wMTljMCA5LjA5OC03LjM3NSAxNi40NzMtMTYuNDczIDE2LjQ3M2gtMTYuMzU4djI2LjkzOGMwIDYuODgzIDUuNTggMTIuNDY0IDEyLjQ2NCAxMi40NjQgMi4xNzIgMCAzLjkzOSAxLjcwMSA0LjA3NiAzLjg2OSAyLjYyOCA0MS42NjggMzcuMjM1IDc0LjY1NCA3OS41NjUgNzQuNjU0IDQyLjMzIDAgNzYuOTM3LTMyLjk4NiA3OS41NjUtNzQuNjU0LjEzNy0yLjE2NyAxLjkwNC0zLjg2OSA0LjA3Ni0zLjg2OSA2Ljg4MyAwIDEyLjQ2NC01LjU4IDEyLjQ2NC0xMi40NjR2LTI2LjkzOXoiIGZpbGw9IiNmZmRkY2UiLz48cGF0aCBkPSJtMzM1LjczIDE4MC4zMThjLTkuMDk4IDAtMTYuNDczLTcuMzc1LTE2LjQ3My0xNi40NzN2LTkuMDE1YzAtMTEuODUxLTExLjU5NS0yMC4yMy0yMi44NDctMTYuNTExLTMuMTA4IDEuMDI3LTYuMjQ3IDEuOTIzLTkuNDA3IDIuNzA3djg4Ljk3MmMtLjQzOCAyOC45NDgtMTYuMyA1NC4xNDItMzkuNzI1IDY3Ljc1OCAyLjg2MS4zMTEgNS43NjMuNDg2IDguNzA2LjQ4NiA0Mi4zMyAwIDc2LjkzNy0zMi45ODYgNzkuNTY1LTc0LjY1NC4xMzctMi4xNjcgMS45MDQtMy44NjkgNC4wNzYtMy44NjkgNi44ODMgMCAxMi40NjQtNS41OCAxMi40NjQtMTIuNDY0di0yNi45MzhoLTE2LjM1OXoiIGZpbGw9IiNmZmNiYmUiLz48L2c+PGcgZmlsbD0iI2Y0ZmJmZiI+PHBhdGggZD0ibTIxMy4xOTQgMzE2LjA2LTMzLjU1OCAyNy4yNjcgMzUuMTkyIDQzLjUxM2M0LjI4MSA0LjE2OCAxMS4wMTkgNC40MjQgMTUuNjA1LjU5NGwyNi40NjUtMjIuMTA3eiIvPjxwYXRoIGQ9Im0yOTguNzkgMzE2LjA2LTQxLjg5MiA0OS4yNjcgMjQuODc0IDIxLjI2OGM0LjU1NyAzLjg5NiAxMS4zMjcgMy43IDE1LjY1MS0uNDUzbDM0Ljk0LTQyLjgxNXoiLz48L2c+PC9nPjxwYXRoIGQ9Im0yMTMuMTk0IDMxNi4wNi00OS4yNTYgMjQuMTk5Yy0zLjc1IDEuODQyLTUuMjU2IDYuNDA0LTMuMzQxIDEwLjExN2w5LjY1IDE4LjcxYzIuNTAxIDQuODQ4IDEuNTc4IDEwLjc1Ni0yLjI4MiAxNC42MS0xLjk4NyAxLjk4My00LjEzOSA0LjEzMS02LjAwNCA1Ljk5My0zLjMzOCAzLjMzMi00LjUzNyA4LjI1NS0zLjA2NyAxMi43MzcgMTEuNjUxIDM1LjUxNyA2Ny43MjUgODkuODI4IDg4Ljk0NiAxMDkuNDc4IDEuNDI3LjAzOCAyLjg1Ny4wNjQgNC4yOS4wOC0xNS4zODktMjkuOTMzLTY5LjkyMi0xNDMuNjU1LTM4LjkzNi0xOTUuOTI0eiIgZmlsbD0iIzM2NWU3ZCIvPjxwYXRoIGQ9Im0zNDQuMDE5IDM4My42OTVjLTMuODYxLTMuODU0LTQuNzgzLTkuNzYyLTIuMjgyLTE0LjYxbDkuNjUtMTguNzFjMS45MTUtMy43MTMuNDA5LTguMjc1LTMuMzQxLTEwLjExN2wtNDkuMjU2LTI0LjE5OGMzMC45NzggNTIuMjU1LTIzLjUxNyAxNjUuOTI5LTM4LjkyMyAxOTUuOSAxLjQ0OC0uMDI1IDIuODkzLS4wNjEgNC4zMzUtLjEwOSAyMS4yNjUtMTkuNjk1IDc3LjI0OC03My45NCA4OC44ODgtMTA5LjQyNCAxLjQ3LTQuNDgyLjI3MS05LjQwNS0zLjA2Ny0xMi43MzctMS44NjUtMS44NjMtNC4wMTctNC4wMTItNi4wMDQtNS45OTV6IiBmaWxsPSIjMzY1ZTdkIi8+PHBhdGggZD0ibTI1Ni44OTggMzY1LjMyNy0yNi4wNiAyMS43NjQgMTMuMjc4IDE2Ljc4MWgyMy43NjdsMTMuMjc5LTE3Ljc3MXoiIGZpbGw9IiNkZDYzNmUiLz48L2c+PC9nPjwvZz48L2c+PC9zdmc+',
      following: followingDivs,
      blocking: blockingDivs,
    });
  }

  handleResetPsw() {
    this.props.history.push({
      pathname: '/password',
    });
  }

  handleDeactivate() {
    alert('Deactivated!');
    console.log(this.state.username);
  }

  render() {
    return (
      <div id="home-root">
        <div className="cols" id="col1">
          <img id="col1-avatar" alt="avatar" src={this.state.avatar_ref} />
          <p>MY INFORMATION</p>
          <div id="user-info">
            <div><span>Nickname: </span>{this.state.nickname}</div>
            <div><span>Username: </span>{this.state.username}</div>
            <div><span>Email: </span>{this.state.email}</div>
            <div><span>Summary:</span></div>
            <div>{this.state.summary}</div>
          </div>
          <button>View My Posts</button>
          <button onClick={this.handleResetPsw}>Reset Password</button>
          <button className="bg-red" onClick={this.handleDeactivate}>Deactivate This Account</button>
        </div>
        <div className="cols" id="col2">
          <textarea id="new-post-input" placeholder="What's happening?">
          </textarea>
          <button id="submit-post">Share with friends</button>
          <div id="feed-items">
            <div className="feed-item">

            </div>
          </div>
        </div>
        <div className="cols" id="col3">
          <div id="contact-title">My Contacts:</div>
          <div id="following">
            <input type="text" placeholder="Search a new user..."></input>
            <button>Follow</button>
            <div id="following-list">
              <div>Currently following:</div>
              {this.state.following}
            </div>
          </div>
          <div id="blocking">
            <input type="text" placeholder="Search a new user..."></input>
            <button>Block</button>
            <div id="blocking-list">
              <div>Currently blocking:</div>
              {this.state.blocking}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const HomeWithRouter = withRouter(Home);
export default HomeWithRouter;
