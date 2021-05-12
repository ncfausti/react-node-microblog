/* eslint-disable max-len */
import React from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';

import '../style/comment.css';

export default class Comment extends React.Component {
  render() {
    return (
      <div className="comment">
      <div className="comment-avatar">
        <img alt="avatar" src={this.props.avatar_ref} />
      </div>
      <div className="comment-main">
        <div className="comment-main-nameplate">
          <span className="comment-nickname">{this.props.nickname}</span>
          <span className="comment-username">@{this.props.username}</span>
          <span className="comment-date"> · {this.props.creation_date}</span>
          <Dropdown as={ButtonGroup} id="post-dropdown">
            <Dropdown.Toggle split variant="secondary" size="sm" id="dropdown-split-basic" />
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => this.props.changeReplyingto(this.props.username)}>Reply</Dropdown.Item>
              {this.props.userid === this.props.viewerid && <Dropdown.Divider />}
              {this.props.userid === this.props.viewerid && <Dropdown.Item onClick={() => this.props.delete(this.props.commentid)}>Delete this comment</Dropdown.Item>}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="replying-to">
          <span>Replying to @{this.props.replying_to}</span>
        </div>
        <div className="comment-main-content">
          {this.props.content}
        </div>
      </div>
    </div>
    );
  }
}
