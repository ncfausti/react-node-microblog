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
      userid: 0,
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
      uploaded: '',
      prevY: 0,
      page: 0,
      postObjects: [],
      showing: '',
      showLoading: false,
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
    this.handleHidePost = this.handleHidePost.bind(this);
    this.handleDeletePost = this.handleDeletePost.bind(this);
    this.handleUploadMedia = this.handleUploadMedia.bind(this);
    this.appendFeed = this.appendFeed.bind(this);
  }

  componentDidMount() {
    const currentUser = 'feng3116';
    Agent.getUserByName(currentUser)
      .then(
        (result) => {
          this.setState({
            userid: result.userid,
            username: result.username,
            nickname: result.nickname,
            email: result.email,
            summary: result.summary,
            registration_date: new Date(`${result.registration_date}+00:00`).toLocaleDateString('en-US'),
            avatar_ref: result.avatar_ref,
          }, () => {
            this.getFeed();
            this.getFollowing();
            this.getBlocking();
          });
        },
        (error) => {
          console.log(error);
        },
      );
    this.observer = new IntersectionObserver(
      this.handleLoading.bind(this),
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      },
    );
    this.observer.observe(this.loadingRef);
  }

  appendFeed(posts) {
    if (posts.length === 0) {
      this.setState({ showLoading: false });
    } else {
      this.setState({
        postObjects: [...this.state.postObjects, ...posts],
        page: this.state.page + 1,
      }, () => this.showPosts());
    }
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
            // this.handleLogout();
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
      Agent.createPost(this.state.userid, this.state.editArea, this.state.uploaded).then(() => {
        this.setState({ editArea: '', uploaded: '' });
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
            this.getFeed();
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
            this.getFeed();
          });
      });
  }

  handleUnfollow(id) {
    Agent.deleteFollow(this.state.userid, id).then(() => {
      this.getFollowing();
      this.getFeed();
    });
  }

  handleUnblock(id) {
    Agent.deleteBlock(this.state.userid, id).then(() => {
      this.getBlocking();
      this.getFeed();
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

  showPosts() {
    const feedDivs = this.state.postObjects.map(
      (feedObject, i) => <Post
                          key={i}
                          avatar_ref={feedObject.avatar_ref}
                          nickname={feedObject.nickname}
                          username={feedObject.username}
                          content={feedObject.content}
                          date={
                            new Date(`${feedObject.creation_date}+00:00`).toLocaleString('en-US')}
                          postid={feedObject.postid}
                          viewerid={this.state.userid}
                          ownerid={feedObject.ownerid}
                          currentuser_avatar_ref={this.state.avatar_ref}
                          hide={this.handleHidePost}
                          delete={this.handleDeletePost}
                          media={feedObject.media}
                        />,
    );
    this.setState({ feed: feedDivs });
  }

  getFeed() {
    Agent.getFeed(this.state.userid).then((res) => {
      if (res.length === 0) {
        alert('Didn\'t find any posts for you.');
      } else {
        this.setState({
          postObjects: res,
          page: 1,
          showing: 'feed',
          showLoading: true,
        }, () => this.showPosts());
      }
    });
  }

  getPostsByUser(id) {
    Agent.getPostsByUser(id).then((res) => {
      if (res.length === 0) {
        alert('Didn\'t find any posts for you.');
      } else {
        this.setState({
          postObjects: res,
          page: 1,
          showing: 'mine',
          showLoading: true,
        }, () => this.showPosts());
      }
    });
  }

  handleMyPosts() {
    this.getPostsByUser(this.state.userid);
  }

  handleViewAll() {
    Agent.getPosts().then((res) => {
      if (res.length === 0) {
        alert('Didn\'t find any posts for you.');
      } else {
        this.setState({
          postObjects: res,
          page: 1,
          showing: 'all',
          showLoading: true,
        }, () => this.showPosts());
      }
    });
  }

  handleLogout() {
    console.log(this.state.userid);
  }

  handleHidePost(id) {
    Agent.hidePost(this.state.userid, id).then(() => this.getFeed());
  }

  handleDeletePost(id) {
    Agent.deletePost(id).then(() => this.getFeed());
  }

  handleUploadMedia(e) {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = () => {
        const base64String = reader.result;
        this.setState({
          uploaded: base64String.substr(base64String.indexOf(', ') + 1),
        }, () => console.log(this.state.uploaded));
      };
    }
  }

  handleLoading(entities) {
    const { y } = entities[0].boundingClientRect;
    if (this.state.prevY > y) {
      if (this.state.showing === 'feed') {
        Agent.getFeed(this.state.userid, this.state.page + 1).then((res) => {
          this.appendFeed(res);
        });
      } else if (this.state.showing === 'mine') {
        Agent.getPostsByUser(this.state.userid, this.state.page + 1).then((res) => {
          this.appendFeed(res);
        });
      } else {
        Agent.getPosts(this.state.page + 1).then((res) => {
          this.appendFeed(res);
        });
      }
    }
    this.setState({ prevY: y === 0 ? 1e7 : y });
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
          <button onClick={() => { window.location.href = '/messaging'; }}>Private Message </button>
          <button onClick={this.handleMyPosts}>View My Posts Only</button>
          <button onClick={this.handleViewAll}>Explore All Posts</button>
          <button onClick={this.handleLogout} id="logout-btn">Log Out</button>
          <button onClick={this.handleResetPsw}>Reset Password</button>
          <button className="bg-red" onClick={this.handleDeactivate}>Deactivate This Account</button>
        </div>
        <div className="cols" id="col2">
          <div id="new-post">
            <textarea
              id="new-post-input"
              placeholder="What's happening?"
              value={this.state.editArea}
              onChange={(e) => this.setState({ editArea: e.target.value })}
              >
            </textarea>
            <div id="media-attach">
              <img src={this.state.uploaded} />
            </div>
          </div>
          <div id="submit-group">
            <div>
              <label htmlFor="img-upload">
                <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iX3gzMV8iIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Im0xNy40NTMgMjRjLS4xNjggMC0uMzQtLjAyMS0uNTEtLjA2NmwtMTUuNDYzLTQuMTQxYy0xLjA2LS4yOTItMS42OTItMS4zOS0xLjQxNC0yLjQ1bDEuOTUxLTcuMjcyYy4wNzItLjI2Ny4zNDYtLjQyMi42MTItLjM1NC4yNjcuMDcxLjQyNS4zNDYuMzU0LjYxMmwtMS45NSA3LjI3Yy0uMTM5LjUzLjE3OSAxLjA4Mi43MSAxLjIyOWwxNS40NTcgNC4xMzljLjUzMS4xNCAxLjA3OS0uMTc2IDEuMjE3LS43MDRsLjc4MS0yLjg5NGMuMDcyLS4yNjcuMzQ2LS40MjYuNjEzLS4zNTMuMjY3LjA3Mi40MjQuMzQ3LjM1My42MTNsLS43OCAyLjg5Yy0uMjM1Ljg5LTEuMDQ1IDEuNDgxLTEuOTMxIDEuNDgxeiIvPjwvZz48Zz48cGF0aCBkPSJtMjIgMThoLTE2Yy0xLjEwMyAwLTItLjg5Ny0yLTJ2LTEyYzAtMS4xMDMuODk3LTIgMi0yaDE2YzEuMTAzIDAgMiAuODk3IDIgMnYxMmMwIDEuMTAzLS44OTcgMi0yIDJ6bS0xNi0xNWMtLjU1MSAwLTEgLjQ0OS0xIDF2MTJjMCAuNTUxLjQ0OSAxIDEgMWgxNmMuNTUxIDAgMS0uNDQ5IDEtMXYtMTJjMC0uNTUxLS40NDktMS0xLTF6Ii8+PC9nPjxnPjxwYXRoIGQ9Im05IDljLTEuMTAzIDAtMi0uODk3LTItMnMuODk3LTIgMi0yIDIgLjg5NyAyIDItLjg5NyAyLTIgMnptMC0zYy0uNTUxIDAtMSAuNDQ5LTEgMXMuNDQ5IDEgMSAxIDEtLjQ0OSAxLTEtLjQ0OS0xLTEtMXoiLz48L2c+PGc+PHBhdGggZD0ibTQuNTcgMTYuOTNjLS4xMjggMC0uMjU2LS4wNDktLjM1NC0uMTQ2LS4xOTUtLjE5NS0uMTk1LS41MTIgMC0uNzA3bDQuNzIzLTQuNzIzYy41NjYtLjU2NiAxLjU1NS0uNTY2IDIuMTIxIDBsMS40MDYgMS40MDYgMy44OTItNC42N2MuMjgzLS4zMzkuNjk5LS41MzYgMS4xNDItLjU0aC4wMTFjLjQzOCAwIC44NTMuMTkgMS4xMzkuNTIzbDUuMjMgNi4xMDJjLjE4LjIwOS4xNTYuNTI1LS4wNTQuNzA1LS4yMDkuMTgtLjUyNC4xNTctLjcwNS0uMDU0bC01LjIzLTYuMTAyYy0uMDk3LS4xMTItLjIzMS0uMTc0LS4zOC0uMTc0LS4xMDQtLjAwOS0uMjg3LjA2My0uMzg0LjE4bC00LjI0MyA1LjA5MWMtLjA5LjEwOC0uMjIxLjE3My0uMzYyLjE3OS0uMTQyLjAxLS4yNzctLjA0Ni0uMzc2LS4xNDZsLTEuNzkzLTEuNzkzYy0uMTg5LS4xODgtLjUxOC0uMTg4LS43MDcgMGwtNC43MjMgNC43MjNjLS4wOTcuMDk3LS4yMjUuMTQ2LS4zNTMuMTQ2eiIvPjwvZz48L3N2Zz4=" />
              </label>
              <input onChange={this.handleUploadMedia} id="img-upload" type="file" />
            </div>
            <button onClick={this.handleSubmitPost} id="submit-post">Share with friends</button>
          </div>
          <div id="feed-items">
            {this.state.feed}
          </div>
          <div
            id="feed-loading"
            ref={(ref) => { this.loadingRef = ref; }}
            style={{ display: this.state.showLoading ? 'block' : 'none' }}
          >
            <span>Loading...</span>
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
