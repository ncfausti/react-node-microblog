import React from 'react';

export default class BlockingContact extends React.Component {
  render() {
    const btnStyle = {
      fontSize: '11px',
      float: 'right',
      border: 'none',
    };
    return (
      <div className="blocking-contact">
        <span style={{ fontWeight: 'bold' }}>{this.props.username}</span>
        <button style={btnStyle}>Unblock</button>
      </div>
    );
  }
}
