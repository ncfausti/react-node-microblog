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
      comments: [],
      numComments: 0,
      replyingTo: this.props.username,
      commentEdit: '',
    };

    this.handleToggleComment = this.handleToggleComment.bind(this);
    this.handleComment = this.handleComment.bind(this);
    this.changeReplyingto = this.changeReplyingto.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
  }

  componentDidMount() {
    this.getComments();
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

  getComments() {
    Agent.getCommentsByPost(this.props.postid).then((res) => {
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
            <div className="post-main-date">
              <span>Posted at {this.props.date}</span>
            </div>
            <div className="post-main-bottom">
              <div className="post-main-bottom-comments" onClick={this.handleToggleComment}>
                <img className="post-comment" alt="comments" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTQ1Ni44MzU5MzggMGgtNDAxLjY2Nzk2OWMtMzAuNDIxODc1IDAtNTUuMTY3OTY5IDI0Ljc0NjA5NC01NS4xNjc5NjkgNTUuMTY3OTY5djI5NC4yMzgyODFjMCAzMC40MTc5NjkgMjQuNzQ2MDk0IDU1LjE2NDA2MiA1NS4xNjc5NjkgNTUuMTY0MDYyaDEyNy4yOTY4NzVsNDIuMTU2MjUgODQuMzE2NDA3YzcuMzQzNzUgMTQuNjg3NSAxOC43ODEyNSAyMy4xMTMyODEgMzEuMzc4OTA2IDIzLjExMzI4MXMyNC4wMzUxNTYtOC40MjU3ODEgMzEuMzc4OTA2LTIzLjExMzI4MWw0Mi4xNjAxNTYtODQuMzE2NDA3aDEyNy4yOTY4NzZjMzAuNDE3OTY4IDAgNTUuMTY0MDYyLTI0Ljc0NjA5MyA1NS4xNjQwNjItNTUuMTY0MDYydi0yOTQuMjM4MjgxYzAtMzAuNDIxODc1LTI0Ljc0NjA5NC01NS4xNjc5NjktNTUuMTY0MDYyLTU1LjE2Nzk2OXptMjUuMTY0MDYyIDM0OS40MDYyNWMwIDEzLjg3NS0xMS4yODkwNjIgMjUuMTY0MDYyLTI1LjE2NDA2MiAyNS4xNjQwNjJoLTEzNi41NjY0MDdjLTUuNjgzNTkzIDAtMTAuODc1IDMuMjEwOTM4LTEzLjQxNzk2OSA4LjI5Mjk2OWwtNDYuMzA0Njg3IDkyLjYwNTQ2OWMtMS44NjcxODcgMy43MzQzNzUtMy42MjEwOTQgNS41NzAzMTItNC41NDY4NzUgNi4yNzM0MzgtLjkyNTc4MS0uNzAzMTI2LTIuNjc5Njg4LTIuNTM5MDYzLTQuNTQ2ODc1LTYuMjczNDM4bC00Ni4zMDQ2ODctOTIuNjA1NDY5Yy0yLjUzOTA2My01LjA4MjAzMS03LjczNDM3Ni04LjI5Mjk2OS0xMy40MTQwNjMtOC4yOTI5NjloLTEzNi41NjY0MDZjLTEzLjg3ODkwNyAwLTI1LjE2Nzk2OS0xMS4yODkwNjItMjUuMTY3OTY5LTI1LjE2NDA2MnYtMjk0LjIzODI4MWMwLTEzLjg3ODkwNyAxMS4yODkwNjItMjUuMTY3OTY5IDI1LjE2Nzk2OS0yNS4xNjc5NjloNDAxLjY2Nzk2OWMxMy44NzUgMCAyNS4xNjQwNjIgMTEuMjg5MDYyIDI1LjE2NDA2MiAyNS4xNjc5Njl6bTAgMCIgZmlsbD0iIzViNzA4MyIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" />
                <span>{this.state.numComments}</span>
              </div>
              <div className="post-main-bottom-retweets">
                <img className="post-retweet" alt="retweets" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMS45OTk5NSA1MTEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCw2MCkiPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTQ5NC41MDM5MDYgMTMwLjg0NzY1Ni0xMTUuOTMzNTk0LTExNS45MzM1OTRjLTkuNTYyNS05LjU2NjQwNi0xOS4yNjU2MjQtMTQuNDE0MDYyLTI4LjgzMjAzMS0xNC40MTQwNjItMTMuMTMyODEyIDAtMjguNDcyNjU2IDkuOTkyMTg4LTI4LjQ3MjY1NiAzOC4xNDg0Mzh2MzcuMDY2NDA2Yy0xNjQuMjczNDM3IDcuMjI2NTYyLTMwMS4wMTU2MjUgMTMyLjQzNzUtMzIxLjE1MjM0NCAyOTYuODk0NTMxLS44MzIwMzEgNi43NzczNDQgMy4wMTk1MzEgMTMuMjU3ODEzIDkuMzY3MTg4IDE1Ljc2OTUzMSAxLjc5Njg3NS43MTA5MzggMy42NjQwNjIgMS4wNTQ2ODggNS41MTE3MTkgMS4wNTQ2ODggNC42NzU3ODEgMCA5LjIxNDg0My0yLjE5MTQwNiAxMi4xMDU0NjgtNi4xNDA2MjUgNTUuMzQzNzUtNzUuNjE3MTg4IDE0NC4yMDcwMzItMTIwLjc2MTcxOSAyMzcuNzAzMTI1LTEyMC43NjE3MTkgMTguODM1OTM4IDAgMzcuNzc3MzQ0IDEuODQzNzUgNTYuNDY0ODQ0IDUuNDkyMTg4djM5LjYzNjcxOGMwIDI4LjE1NjI1IDE1LjMzOTg0NCAzOC4xNDg0MzggMjguNDcyNjU2IDM4LjE0ODQzOGguMDAzOTA3YzkuNTY2NDA2IDAgMTkuMjY1NjI0LTQuODUxNTYzIDI4LjgyODEyNC0xNC40MTQwNjNsMTE1LjkzMzU5NC0xMTUuOTMzNTkzYzIzLjMyODEyNS0yMy4zMjgxMjYgMjMuMzI4MTI1LTYxLjI4NTE1NyAwLTg0LjYxMzI4MnptLTIxLjIwNzAzMSA2My40MDYyNS0xMTUuOTMzNTk0IDExNS45Mjk2ODhjLTIuMjMwNDY5IDIuMjMwNDY4LTQuMDc0MjE5IDMuNjM2NzE4LTUuNDMzNTkzIDQuNDg4MjgxLS4zNTkzNzYtMS41NjI1LS42Njc5NjktMy44NTkzNzUtLjY2Nzk2OS03LjAxMTcxOXYtNTEuNzQyMTg3YzAtNi45NDkyMTktNC43ODEyNS0xMi45OTIxODgtMTEuNTQ2ODc1LTE0LjU5Mzc1LTI0LjY2MDE1Ni01LjgzMjAzMS00OS44NjMyODItOC43ODUxNTctNzQuOTE0MDYzLTguNzg1MTU3LTUxLjg1OTM3NSAwLTEwMy40NDUzMTIgMTIuNTQ2ODc2LTE0OS4xNzk2ODcgMzYuMjkyOTY5LTI2LjkwNjI1IDEzLjk2ODc1LTUxLjg2NzE4OCAzMS44MTY0MDctNzMuOTM3NSA1Mi43MzgyODEgMzkuNjA5Mzc1LTEyNi40MjE4NzQgMTU3LjgyODEyNS0yMTYuMTg3NSAyOTQuNTgyMDMxLTIxNi4xODc1IDguMjgxMjUgMCAxNC45OTYwOTQtNi43MTQ4NDMgMTQuOTk2MDk0LTE1di01MS43MzQzNzRjMC0zLjE1MjM0NC4zMDg1OTMtNS40NDkyMTkuNjY3OTY5LTcuMDE1NjI2IDEuMzU5Mzc0Ljg1MTU2MyAzLjIwMzEyNCAyLjI2MTcxOSA1LjQzMzU5MyA0LjQ4ODI4MmwxMTUuOTMzNTk0IDExNS45MzM1OTRjMTEuNjMyODEzIDExLjYzMjgxMiAxMS42MzI4MTMgMzAuNTYyNSAwIDQyLjE5OTIxOHptMCAwIiBmaWxsPSIjNWI3MDgzIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PC9nPjwvc3ZnPg==" />
                <span>{0}</span>
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
      </div>
    );
  }
}
