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
      registration_date: '',
      avatar_ref: '',
      following: [],
      blocking: [],
    };

    this.handleResetPsw = this.handleResetPsw.bind(this);
    this.handleDeactivate = this.handleDeactivate.bind(this);
  }

  componentDidMount() {
    const currentUser = 'feng3116';
    fetch(`http://localhost:5001/user/${currentUser}`, {
      method: 'GET',
    }).then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            username: result.username,
            nickname: result.nickname,
            email: result.email,
            summary: result.summary,
            registration_date: new Date(`${result.registration_date} GMT`).toLocaleDateString('en-US'),
            avatar_ref: result.avatar_ref,
          });
          console.log(result.userid);
          const followingList = [{ username: 'user132' }, { username: 'user22234' }];
          const followingDivs = followingList.map(
            (followingObject, i) => <FollowingContact
                                      key={i}
                                      username={followingObject.username}
                                    />,
          );
          const blockingList = [{ username: 'user456' }, { username: 'user84634' }];
          const blockingDivs = blockingList.map(
            (blockingObject, i) => <BlockingContact key={i} username={blockingObject.username} />,
          );
          this.setState({
            following: followingDivs,
            blocking: blockingDivs,
          });
        },
        (error) => {
          console.log(error);
        },
      );
  }

  handleResetPsw() {
    this.props.history.push({
      pathname: '/password',
    });
  }

  handleDeactivate() {
    fetch(`http://localhost:5001/user/${this.state.username}/is_active`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: false,
      }),
    }).then((res) => res.json())
      .then(
        (result) => {
          if (result.status == 'ok') {
            alert('Deactivated!');
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        },
      );
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
            <div><span>Registered on: </span>{this.state.registration_date}</div>
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
