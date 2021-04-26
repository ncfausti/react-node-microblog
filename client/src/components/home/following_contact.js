import React from 'react';

export default class FollowingContact extends React.Component {
  render() {
    const btnStyle = {
      fontSize: '11px',
      float: 'right',
      border: 'none',
    };
    return (
      <div className="following-contact">
        <span style={{ fontWeight: 'bold' }}>{this.props.username}</span>
        <button
          style={btnStyle}
          onClick={() => this.props.unfollow(this.props.userid)}
        >Unfollow</button>
      </div>
    );
  }
}
