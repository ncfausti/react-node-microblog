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
            <img className="icon" src="https://www.flaticon.com/svg/vstatic/svg/545/545674.svg?token=exp=1614699624~hmac=62fe41f6a1e4895531d90746ee0fef08" alt="info">
            </img>
          </div>
        </div>

        <div className="container">
          <img src="https://www.flaticon.com/premium-icon/icons/svg/2202/2202112.svg" alt="Avatar"></img>
          <p>Hey! I was wondering if you could help me change the destination
             of a recent order I placed?</p>
          <span className="time-right">11:00</span>
        </div>

        <div className="container mine">
          <img src="https://www.flaticon.com/svg/vstatic/svg/3135/3135715.svg?token=exp=1614703440~hmac=c0926a03bf4b6f1655c3eb2a7e2604f5" alt="Avatar" className="right">
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
          <img src="https://www.flaticon.com/svg/vstatic/svg/3135/3135715.svg?token=exp=1614703440~hmac=c0926a03bf4b6f1655c3eb2a7e2604f5" alt="Avatar" className="right"></img>
          <p>I was in the bouncy. Also tell me if you get an invitation on the calender now.</p>
          <span className="time-left">11:05</span>
        </div>

        <div className="inputbox">
          <input type="text" placeholder="Start a new message"></input>
          <img alt="send" src="https://www.flaticon.com/svg/vstatic/svg/786/786407.svg?token=exp=1614705696~hmac=1f5ed9ca0ff518c562b4a72f38b3c5f9"></img>
        </div>
      </div>
    );
  }
}

export default Messaging;
