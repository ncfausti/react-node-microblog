/* eslint-disable max-len */
import React from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import Comment from './comment';
import Agent from './fetches';

import '../style/dropdown.css';
import '../style/post.css';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
      showAnalysis: false,
      comments: [],
      numComments: 0,
      numHides: 0,
      commentedBy: [],
      hiddenBy: [],
      replyingTo: this.props.username,
      commentEdit: '',
    };

    this.handleToggleComment = this.handleToggleComment.bind(this);
    this.handleToggleAnalysis = this.handleToggleAnalysis.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.changeReplyingto = this.changeReplyingto.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getHides = this.getHides.bind(this);
  }

  componentDidMount() {
    this.getComments();
    this.getHides();
  }

  componentDidUpdate() {
    this.getComments();
    this.getHides();
  }

  handleToggleComment() {
    if (this.state.showComments) {
      this.setState({ showComments: false });
    } else {
      this.setState({ showComments: true });
    }
  }

  handleComment() {
    if (this.state.commentEdit.length > 0) {
      Agent.comment(
        this.props.viewerid,
        this.props.postid,
        this.state.replyingTo,
        this.state.commentEdit,
      ).then(() => {
        this.getComments();
        this.setState({ commentEdit: '' });
      }).catch((err) => console.log(err));
    }
  }

  handleDeleteComment(id) {
    Agent.deleteComment(id).then(() => {
      this.getComments();
    });
  }

  handleToggleAnalysis() {
    if (this.state.showAnalysis) {
      this.setState({ showAnalysis: false });
    } else {
      this.setState({ showAnalysis: true });
    }
  }

  getComments() {
    Agent.getCommentsByPost(this.props.postid).then((res) => {
      let usernames = [];
      res.forEach((obj) => usernames.push(obj.username));
      usernames = [...new Set(usernames)];
      this.setState({ commentedBy: usernames });
      const commentsJsx = res.map(
        (comment, i) => <Comment
                          key={i}
                          commentid={comment.commentid}
                          userid={comment.userid}
                          avatar_ref={comment.avatar_ref}
                          username={comment.username}
                          nickname={comment.nickname}
                          creation_date={
                            new Date(`${comment.creation_date}+00:00`).toLocaleString('en-US')}
                          content={comment.content}
                          replying_to={comment.replying_to}
                          changeReplyingto={this.changeReplyingto}
                          viewerid={this.props.viewerid}
                          delete={this.handleDeleteComment}
                        />,
      );
      this.setState({ comments: commentsJsx, numComments: commentsJsx.length });
    });
  }

  getHides() {
    Agent.getHidesByPost(this.props.postid).then((res) => {
      const hiddenBy = [];
      res.forEach((obj) => hiddenBy.push(obj.username));
      this.setState({ numHides: hiddenBy.length, hiddenBy });
    });
  }

  changeReplyingto(username) {
    this.setState({ replyingTo: username });
  }

  render() {
    return (
      <div className="feed-item">
        <div className="post">
          <div className="post-nameplate">
            <div className="post-avatar">
              <img alt="avatar" src={this.props.avatar_ref} />
            </div>
            <div className="post-name">
              <div className="post-nickname">{this.props.nickname}</div>
              <div className="post-username">@{this.props.username}</div>
            </div>
            <div className="post-dropdown-div">
            <Dropdown as={ButtonGroup} id="post-dropdown">
              <Dropdown.Toggle split variant="secondary" size="sm" id="dropdown-split-basic" />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.setState({ replyingTo: this.props.username, showComments: true })}>Reply</Dropdown.Item>
                <Dropdown.Divider />
                {this.props.viewerid !== this.props.ownerid && <Dropdown.Item onClick={() => this.props.hide(this.props.postid)}>Hide this post</Dropdown.Item>}
                {this.props.viewerid === this.props.ownerid && <Dropdown.Item onClick={() => this.props.delete(this.props.postid)}>Delete this post</Dropdown.Item>}
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </div>
          <div className="post-main">
            <div className="post-main-content">
              {this.props.content}
            </div>
            <div className="post-main-media">
              <img src={this.props.media} />
            </div>
            <div className="post-main-date">
              <span>Posted at {this.props.date}</span>
            </div>
            <div className="post-main-bottom">
              <div className="post-main-bottom-comments" onClick={this.handleToggleComment}>
                <img className="post-comment" alt="comments" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTQ1Ni44MzU5MzggMGgtNDAxLjY2Nzk2OWMtMzAuNDIxODc1IDAtNTUuMTY3OTY5IDI0Ljc0NjA5NC01NS4xNjc5NjkgNTUuMTY3OTY5djI5NC4yMzgyODFjMCAzMC40MTc5NjkgMjQuNzQ2MDk0IDU1LjE2NDA2MiA1NS4xNjc5NjkgNTUuMTY0MDYyaDEyNy4yOTY4NzVsNDIuMTU2MjUgODQuMzE2NDA3YzcuMzQzNzUgMTQuNjg3NSAxOC43ODEyNSAyMy4xMTMyODEgMzEuMzc4OTA2IDIzLjExMzI4MXMyNC4wMzUxNTYtOC40MjU3ODEgMzEuMzc4OTA2LTIzLjExMzI4MWw0Mi4xNjAxNTYtODQuMzE2NDA3aDEyNy4yOTY4NzZjMzAuNDE3OTY4IDAgNTUuMTY0MDYyLTI0Ljc0NjA5MyA1NS4xNjQwNjItNTUuMTY0MDYydi0yOTQuMjM4MjgxYzAtMzAuNDIxODc1LTI0Ljc0NjA5NC01NS4xNjc5NjktNTUuMTY0MDYyLTU1LjE2Nzk2OXptMjUuMTY0MDYyIDM0OS40MDYyNWMwIDEzLjg3NS0xMS4yODkwNjIgMjUuMTY0MDYyLTI1LjE2NDA2MiAyNS4xNjQwNjJoLTEzNi41NjY0MDdjLTUuNjgzNTkzIDAtMTAuODc1IDMuMjEwOTM4LTEzLjQxNzk2OSA4LjI5Mjk2OWwtNDYuMzA0Njg3IDkyLjYwNTQ2OWMtMS44NjcxODcgMy43MzQzNzUtMy42MjEwOTQgNS41NzAzMTItNC41NDY4NzUgNi4yNzM0MzgtLjkyNTc4MS0uNzAzMTI2LTIuNjc5Njg4LTIuNTM5MDYzLTQuNTQ2ODc1LTYuMjczNDM4bC00Ni4zMDQ2ODctOTIuNjA1NDY5Yy0yLjUzOTA2My01LjA4MjAzMS03LjczNDM3Ni04LjI5Mjk2OS0xMy40MTQwNjMtOC4yOTI5NjloLTEzNi41NjY0MDZjLTEzLjg3ODkwNyAwLTI1LjE2Nzk2OS0xMS4yODkwNjItMjUuMTY3OTY5LTI1LjE2NDA2MnYtMjk0LjIzODI4MWMwLTEzLjg3ODkwNyAxMS4yODkwNjItMjUuMTY3OTY5IDI1LjE2Nzk2OS0yNS4xNjc5NjloNDAxLjY2Nzk2OWMxMy44NzUgMCAyNS4xNjQwNjIgMTEuMjg5MDYyIDI1LjE2NDA2MiAyNS4xNjc5Njl6bTAgMCIgZmlsbD0iIzViNzA4MyIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" />
                <span>{this.state.numComments}</span>
              </div>
              <div className="post-main-bottom-retweets" onClick={this.handleToggleAnalysis}>
                <img className="post-retweet" alt="analysis" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ4MC4xODIgNDgwLjE4MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMjAwLjE4MiwzMi4xMDZjLTkyLjc4NCwwLTE2OCw3NS4yMTYtMTY4LDE2OHM3NS4yMTYsMTY4LDE2OCwxNjhzMTY4LTc1LjIxNiwxNjgtMTY4ICAgIEMzNjguMDgxLDEwNy4zNjQsMjkyLjkyNCwzMi4yMDcsMjAwLjE4MiwzMi4xMDZ6IE0yMDAuMTgyLDQ4LjEwNmM0OS40MTYsMC4wMzksOTUuNzIzLDI0LjEyMywxMjQuMTI4LDY0LjU2bC0yMCwyMCAgICBjLTQuODY3LTIuOTQ1LTEwLjQzOS00LjUyMS0xNi4xMjgtNC41NmMtMTcuNjczLDAtMzIsMTQuMzI3LTMyLDMyYzAuMDI4LDUuNjk1LDEuNTk1LDExLjI3Niw0LjUzNiwxNi4xNTJsLTUyLjM4NCw1Mi4zODQgICAgYy05LjkxOS02LjA0OC0yMi4zODUtNi4wNDgtMzIuMzA0LDBsLTM2LjM4NC0zNi4zODRjMi45NDEtNC44NzYsNC41MDgtMTAuNDU3LDQuNTM2LTE2LjE1MiAgICBjMC4wMjItMTcuNjM4LTE0LjI1OC0zMS45NTQtMzEuODk2LTMxLjk3NmMtMTQuNTg3LTAuMDE4LTI3LjMzMiw5Ljg0OS0zMC45NjgsMjMuOTc2aC0yOS42OCAgICBDNjYuNzg1LDk4LjE1OSwxMjguNjE0LDQ4LjIxMSwyMDAuMTgyLDQ4LjEwNnogTTMwNC4xODIsMTYwLjEwNmMwLDguODM3LTcuMTYzLDE2LTE2LDE2cy0xNi03LjE2My0xNi0xNnM3LjE2My0xNiwxNi0xNiAgICBTMzA0LjE4MiwxNTEuMjY5LDMwNC4xODIsMTYwLjEwNnogTTIwOC4xODIsMjU2LjEwNmMwLDguODM3LTcuMTYzLDE2LTE2LDE2cy0xNi03LjE2My0xNi0xNmMwLTguODM3LDcuMTYzLTE2LDE2LTE2ICAgIFMyMDguMTgyLDI0Ny4yNjksMjA4LjE4MiwyNTYuMTA2eiBNMTI4LjE4MiwxNzYuMTA2YzAsOC44MzctNy4xNjMsMTYtMTYsMTZzLTE2LTcuMTYzLTE2LTE2czcuMTYzLTE2LDE2LTE2ICAgIFMxMjguMTgyLDE2Ny4yNjksMTI4LjE4MiwxNzYuMTA2eiBNMjc0LjAzNiwzMzMuMDEyYy0yMi41OTIsMTIuNTQ0LTQ4LjAxMiwxOS4xMTYtNzMuODU0LDE5LjA5MyAgICBjLTgzLjg5LDAuMDU3LTE1MS45NDMtNjcuOTAyLTE1Mi0xNTEuNzkyYy0wLjAwNC01LjQxNCwwLjI4Mi0xMC44MjUsMC44NTYtMTYuMjA4aDMyLjI4YzMuNjM3LDE0LjA4NSwxNi4zMTcsMjMuOTQ1LDMwLjg2NCwyNCAgICBjNS42OTUtMC4wMjgsMTEuMjc2LTEuNTk1LDE2LjE1Mi00LjUzNmwzNi4zODQsMzYuMzg0Yy0yLjk0MSw0Ljg3Ni00LjUwOCwxMC40NTctNC41MzYsMTYuMTUyYzAsMTcuNjczLDE0LjMyNywzMiwzMiwzMiAgICBzMzItMTQuMzI3LDMyLTMyYy0wLjAyOC01LjY5NS0xLjU5NS0xMS4yNzYtNC41MzYtMTYuMTUybDUyLjM4NC01Mi4zODRjNC44NzYsMi45NDEsMTAuNDU3LDQuNTA4LDE2LjE1Miw0LjUzNiAgICBjMTcuNjczLDAsMzItMTQuMzI3LDMyLTMyYy0wLjAyOC01LjY5NS0xLjU5NS0xMS4yNzYtNC41MzYtMTYuMTUybDE3LjQ0LTE3LjQzMkMzNzMuODAxLDE5OS44NDksMzQ3LjM2MywyOTIuMjk4LDI3NC4wMzYsMzMzLjAxMiAgICB6IiBmaWxsPSIjNWI3MDgzIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik00MDAuMTgyLDgwLjEwNmMxNC41NDctMC4wNTUsMjcuMjI3LTkuOTE0LDMwLjg2NC0yNGg0OS4xMzZ2LTE2aC00OS4xMzZjLTMuNjM3LTE0LjA4Ni0xNi4zMTctMjMuOTQ1LTMwLjg2NC0yNCAgICBjLTE3LjY3MywwLTMyLDE0LjMyNy0zMiwzMmMwLjAyOCw1LjY5NSwxLjU5NSwxMS4yNzYsNC41MzYsMTYuMTUybC0xNC4wNTYsMTQuMDU2QzI5MS40MDctOS4zMDcsMTY1Ljg1NS0yNS44MTcsNzguMjM0LDQxLjQzOCAgICBTLTI1Ljg5NywyMzQuMjQ2LDQxLjM1OCwzMjEuODY3YzYzLjQ4NCw4Mi43MDcsMTc5Ljg1NSwxMDIuNzcsMjY3LjM2OCw0Ni4wOTVsMjQuMTQ0LDI0LjE0NGwxMS4zMTIsMTEuMzEybDY0LjQsNjQuNCAgICBjMTYuMzc5LDE2LjM3OSw0Mi45MzMsMTYuMzc5LDU5LjMxMiwwYzE2LjM3OS0xNi4zNzksMTYuMzc5LTQyLjkzMywwLTU5LjMxMmwtNjQuNC02NC40bC0xMS4zMTItMTEuMzEybC0yNC4xNDQtMjQuMTQ0ICAgIGM0Mi44NTktNjYuMDE2LDQyLjg1OS0xNTEuMDcxLDAtMjE3LjA4OGwxNi0xNkMzODguOTExLDc4LjUwNCwzOTQuNDksODAuMDc0LDQwMC4xODIsODAuMTA2eiBNNDAwLjE4MiwzMi4xMDYgICAgYzguODM3LDAsMTYsNy4xNjMsMTYsMTZzLTcuMTYzLDE2LTE2LDE2cy0xNi03LjE2My0xNi0xNlMzOTEuMzQ2LDMyLjEwNiw0MDAuMTgyLDMyLjEwNnogTTQ1Ni41ODIsNDE5LjgxOCAgICBjMTAuMjQ2LDEwLjAxNiwxMC40MzMsMjYuNDQyLDAuNDE3LDM2LjY4OGMtMTAuMDE2LDEwLjI0Ni0yNi40NDIsMTAuNDMzLTM2LjY4OCwwLjQxN2MtMC4xNDEtMC4xMzctMC4yNzktMC4yNzYtMC40MTctMC40MTcgICAgbC02NC40LTY0LjRsMzYuNjg4LTM2LjY4OEw0NTYuNTgyLDQxOS44MTh6IE0zODAuODcsMzQ0LjEwNmwtMzYuNjg4LDM2LjY4OGwtMjIuMTQ0LTIyLjE0NGMxLjEyOC0wLjg2NCwyLjE4NC0xLjgxNiwzLjI5Ni0yLjcwNCAgICBzMi40LTEuOTUyLDMuNTkyLTIuOTUyYzEuNzUyLTEuNDcyLDMuNDgtMi45Niw1LjE3Ni00LjQ4OGMwLjg3Mi0wLjgsMS43MDQtMS42LDIuNTYtMi40YzMuMjgtMy4wNzIsNi40NTYtNi4yNDgsOS41MjgtOS41MjggICAgYzAuOC0wLjg1NiwxLjYtMS42ODgsMi40LTIuNTZjMS41MjgtMS42OTYsMy4wMTYtMy40MjQsNC40ODgtNS4xNzZjMS4wMDMtMS4xODQsMS45ODctMi4zODEsMi45NTItMy41OTIgICAgYzAuODgtMS4xMDQsMS44MzItMi4xNiwyLjY5Ni0zLjI4OEwzODAuODcsMzQ0LjEwNnogTTM0OS44NDYsMzA2Ljk0NmMtMi41MiwzLjUyLTUuMTIsNi45NjgtNy44NjQsMTAuMjg4ICAgIGMtMC44LDAuOTY4LTEuNjU2LDEuOTA0LTIuNDgsMi44NTZjLTIuNDQ4LDIuODQ4LTQuOTc2LDUuNjExLTcuNTg0LDguMjg4Yy0xLjEzNiwxLjE3My0yLjI5MSwyLjMyOC0zLjQ2NCwzLjQ2NCAgICBjLTIuNjY3LDIuNjA4LTUuNDI5LDUuMTM2LTguMjg4LDcuNTg0Yy0wLjk1MiwwLjgtMS44ODgsMS42NzItMi44NTYsMi40OGMtMy4zMiwyLjc0NC02Ljc2OCw1LjM0NC0xMC4yODgsNy44NjQgICAgYy04Mi44MTYsNTkuMTY1LTE5Ny45MTUsMzkuOTkyLTI1Ny4wOC00Mi44MjRTOS45NSwxMDkuMDMxLDkyLjc2Niw0OS44NjZTMjkwLjY4MSw5Ljg3MywzNDkuODQ2LDkyLjY5ICAgIEMzOTUuNjI3LDE1Ni43NzIsMzk1LjYyNywyNDIuODY0LDM0OS44NDYsMzA2Ljk0NnoiIGZpbGw9IiM1YjcwODMiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+" />
                <span>{this.state.numHides}</span>
              </div>
              <div className="post-main-bottom-likes">
                <img className="post-like" alt="likes" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQxMi43MzUgNDEyLjczNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMjk1LjcwNiwzNS41MjJDMjk1LjcwNiwzNS41MjIsMjk1LjcwNiwzNS41MjIsMjk1LjcwNiwzNS41MjJjLTM0LjQzLTAuMTg0LTY3LjE2MSwxNC45MzctODkuMzM5LDQxLjI3MyAgICBjLTIyLjAzOS0yNi41MTYtNTQuODYxLTQxLjY4LTg5LjMzOS00MS4yNzNDNTIuMzk1LDM1LjUyMiwwLDg3LjkxNywwLDE1Mi41NUMwLDI2My4zMSwxOTMuMzA2LDM3MS40NTYsMjAxLjE0MywzNzUuNjM2ICAgIGMzLjE2MiwyLjExMyw3LjI4NiwyLjExMywxMC40NDksMGM3LjgzNy00LjE4LDIwMS4xNDMtMTEwLjc1OSwyMDEuMTQzLTIyMy4wODZDNDEyLjczNSw4Ny45MTcsMzYwLjMzOSwzNS41MjIsMjk1LjcwNiwzNS41MjJ6ICAgICBNMjA2LjM2NywzNTQuNzM4QzE3Ni4wNjUsMzM2Ljk3NSwyMC44OTgsMjQyLjQxMiwyMC44OTgsMTUyLjU1YzAtNTMuMDkxLDQzLjAzOS05Ni4xMzEsOTYuMTMxLTk2LjEzMSAgICBjMzIuNTEyLTAuNDI3LDYyLjkzOCwxNS45NzIsODAuNDU3LDQzLjM2M2MzLjU1Nyw0LjkwNSwxMC40MTgsNS45OTgsMTUuMzIzLDIuNDRjMC45MzctMC42OCwxLjc2MS0xLjUwMywyLjQ0LTIuNDQgICAgYzI5LjA1NS00NC40MzUsODguNjMxLTU2LjkwMywxMzMuMDY2LTI3Ljg0OGMyNy4yMDIsMTcuNzg3LDQzLjU3NSw0OC4xMTQsNDMuNTIxLDgwLjYxNSAgICBDMzkxLjgzNywyNDMuNDU2LDIzNi42NjksMzM3LjQ5NywyMDYuMzY3LDM1NC43Mzh6IiBmaWxsPSIjNWI3MDgzIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==" />
                <span>{0}</span>
              </div>
            </div>
          </div>
        </div>
        {this.state.showComments && this.state.comments}
        {this.state.showComments
          && <div className="edit-comment">
            <img alt="avatar" src={this.props.currentuser_avatar_ref} />
            <input
              placeholder={`Replying to @${this.state.replyingTo}:`}
              value={this.state.commentEdit}
              onChange={(e) => this.setState({ commentEdit: e.target.value })}
            />
            <button onClick={() => this.handleComment()}>Reply</button>
          </div>
        }
        {this.state.showAnalysis
          && <div className="post-analysis">
            <div>As of now, {this.state.numComments} people commented on this post (usernames shown below):</div>
            <div className="post-analysis-comments">{this.state.commentedBy.join(', ')}</div>
            <div>As of now, {this.state.numHides} people hide this post (usernames shown below):</div>
            <div className="post-analysis-hides">{this.state.hiddenBy.join(', ')}</div>
          </div>
        }
      </div>
    );
  }
}
