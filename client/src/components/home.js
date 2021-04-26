import React from 'react';
import { withRouter } from 'react-router';
import '../style/home.css';
import FollowingContact from './home/following_contact';
import BlockingContact from './home/blocking_contact';
import Post from './post';
import Agent from './fetches';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: 31,
      username: '',
      nickname: '',
      email: '',
      summary: '',
      registration_date: '',
      avatar_ref: '',
      following: [],
      blocking: [],
      editArea: '',
      followSearch: '',
      blockSearch: '',
      feed: [],
    };

    this.handleResetPsw = this.handleResetPsw.bind(this);
    this.handleDeactivate = this.handleDeactivate.bind(this);
    this.handleSubmitPost = this.handleSubmitPost.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.handleBlock = this.handleBlock.bind(this);
    this.handleUnblock = this.handleUnblock.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.getBlocking = this.getBlocking.bind(this);
    this.getFeed = this.getFeed.bind(this);
    this.handleMyPosts = this.handleMyPosts.bind(this);
    this.handleViewAll = this.handleViewAll.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const currentUser = 'feng3116';
    Agent.getUserByName(currentUser)
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
          this.getBlocking();
          this.getFollowing().then(() => {
            this.getFeed();
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
    if (window.confirm('Are you sure? This will clear all of your activities.')) {
      Agent.deactivate(this.state.username).then(
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
  }

  handleSubmitPost() {
    if (this.state.editArea.length > 500) {
      alert('Your post exceeded length limit (500 characters).');
    } else {
      Agent.createPost(this.state.userid, this.state.editArea).then(() => {
        this.setState({ editArea: '' });
        this.getFeed();
      });
    }
  }

  handleFollow() {
    Agent.getUserByName(this.state.followSearch)
      .then((user) => {
        Agent.addFollow(this.state.userid, user.userid)
          .then(() => {
            this.setState({ followSearch: '' });
            this.getFollowing();
          });
      });
  }

  handleBlock() {
    Agent.getUserByName(this.state.blockSearch)
      .then((user) => {
        Agent.addBlock(this.state.userid, user.userid)
          .then(() => {
            this.setState({ blockSearch: '' });
            this.getBlocking();
          });
      });
  }

  handleUnfollow(id) {
    Agent.deleteFollow(this.state.userid, id).then(() => {
      this.getFollowing();
    });
  }

  handleUnblock(id) {
    Agent.deleteBlock(this.state.userid, id).then(() => {
      this.getBlocking();
    });
  }

  getFollowing() {
    return Agent.getFollowing(this.state.userid).then((res) => {
      const followingDivs = res.map(
        (followingObject, i) => <FollowingContact
                                  key={i}
                                  userid={followingObject.userid}
                                  username={followingObject.username}
                                  unfollow={this.handleUnfollow}
                                />,
      );
      this.setState({ following: followingDivs });
    });
  }

  getBlocking() {
    Agent.getBlocking(this.state.userid).then((res) => {
      const blockingDivs = res.map(
        (blockingObject, i) => <BlockingContact
                                  key={i}
                                  userid={blockingObject.userid}
                                  username={blockingObject.username}
                                  unblock={this.handleUnblock}
                                />,
      );
      this.setState({ blocking: blockingDivs });
    });
  }

  showPosts(postObjects) {
    const feedDivs = postObjects.map(
      (feedObject, i) => <Post
                          key={i}
                          avatar_ref={feedObject.avatar_ref}
                          nickname={feedObject.nickname}
                          username={feedObject.username}
                          content={feedObject.content}
                          date={
                            new Date(`${feedObject.creation_date} GMT`).toLocaleString('en-US')}
                          numComments={feedObject.num_comments}
                          numRetweets={feedObject.num_retweets}
                          numLikes={feedObject.num_likes}
                        />,
    );
    this.setState({ feed: feedDivs });
  }

  getFeed() {
    Agent.getFeed(this.state.userid).then((res) => {
      this.showPosts(res);
    });
  }

  getPostsByUser(id) {
    Agent.getPostsByUser(id).then((res) => {
      this.showPosts(res);
    });
  }

  handleMyPosts() {
    this.getPostsByUser(this.state.userid);
  }

  handleViewAll() {
    Agent.getPosts().then((res) => {
      this.showPosts(res);
    });
  }

  handleLogout() {
    console.log(this.state.userid);
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
          <button onClick={this.handleMyPosts}>View My Posts Only</button>
          <button onClick={this.handleViewAll}>Explore All Posts</button>
          <br />
          <button onClick={this.handleLogout}>Log Out</button>
          <button onClick={this.handleResetPsw}>Reset Password</button>
          <button className="bg-red" onClick={this.handleDeactivate}>Deactivate This Account</button>
        </div>
        <div className="cols" id="col2">
          <textarea
            id="new-post-input"
            placeholder="What's happening?"
            value={this.state.editArea}
            onChange={(e) => this.setState({ editArea: e.target.value })}
            >
          </textarea>
          <button onClick={this.handleSubmitPost} id="submit-post">Share with friends</button>
          <div id="feed-items">
            {this.state.feed}
          </div>
        </div>
        <div className="cols" id="col3">
          <div id="contact-title">My Contacts:</div>
          <div id="following">
            <input
            type="text"
            placeholder="Search a new user..."
            value={this.state.followSearch}
            onChange={(e) => this.setState({ followSearch: e.target.value })}
            />
            <button onClick={this.handleFollow}>Follow</button>
            <div id="following-list">
              <div>Currently following:</div>
              {this.state.following}
            </div>
          </div>
          <div id="blocking">
            <input
            type="text"
            placeholder="Search a new user..."
            value={this.state.blockSearch}
            onChange={(e) => this.setState({ blockSearch: e.target.value })}
            />
            <button onClick={this.handleBlock}>Block</button>
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
