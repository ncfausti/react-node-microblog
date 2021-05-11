/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../style/messaging.css';
import { useHistory } from 'react-router';
import Agent from './fetches';

const bucketName = 'cis577-messages';

const Messaging = ({ state }) => {
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [messageType, setMessageType] = useState('text');
  const [users, setUsers] = useState([]);
  const [thisUser, setThisUser] = useState('');
  const [audio, setAudio] = useState();
  const [video, setVideo] = useState();
  const [image, setImage] = useState();
  const history = useHistory();

  useEffect(() => {
    if (history && history.location && history.location.state) {
      setThisUser(history.location.state.username);
    }
    window.onclick = (event) => {
      if (event.target == document.getElementById('messagingModal')) {
        document.getElementById('messagingModal').style.display = 'text';
      }
    };
  }, []);

  useEffect(() => {
    if (thisUser != '') {
      Agent.getMessages(thisUser)
        .then((res) => {
          res.forEach((message) => {
            if (!message.seen) {
              Agent.seeMessage(message.idMessages);
            }
          });
          setMessages(res);
        });
      Agent.getUsers()
        .then((res) => {
          setUsers(res);
        });
      Agent.getSentMessages(thisUser)
        .then((res) => {
          setSentMessages(res);
        });
    }
  }, [thisUser]);

  const openModal = () => {
    document.getElementById('messagingModal').style.display = 'block';
  };

  const closeModal = () => {
    document.getElementById('messagingModal').style.display = 'none';
  };

  const sendMessage = () => {
    const srcUser = thisUser;
    const dstUser = document.getElementById('dstUsers').value;
    const text = messageType === 'text' ? document.getElementById('text').value : null;

    Agent.publishMessage(srcUser, dstUser, text, audio, video, image);
    closeModal();
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%' }}>
        Your Private Messages
        <div>
          {messages.map((message, index) => (
              <div key={index}>
                <div>
                  From: {message.srcUser}
                </div>
                <div>
                  {message.type === 'text'
                  && <div>
                      {message.text}
                    </div>
                  }
                  {message.type === 'image'
                  && <img src={message.mediaUrl} style={{ maxHeight: '200px' }}>
                    </img>
                  }
                  {message.type === 'video'
                  && <video controls src={message.mediaUrl} style={{ maxHeight: '200px' }}>
                    </video>
                  }
                  {message.type === 'audio'
                  && <audio controls src={message.mediaUrl} style={{ maxHeight: '200px' }}>
                    </audio>
                  }
                </div>
              </div>
          ))}
        </div>
      </div>
      <div style={{ width: '50%' }}>
        <button id={'msgModalBtn'} onClick={openModal}>
          Send Private Message
        </button>
        <div style={{ width: '50%' }}>
          Your Sent Messages
          <div id='sentMessages'>
            {sentMessages.map((message, index) => (
                <div key={index}>
                  <div>
                    To: {message.dstUser}
                  </div>
                  <div>
                    {message.type === 'text'
                    && <div>
                        {message.text}
                      </div>
                    }
                    {message.type === 'image'
                    && <img src={message.mediaUrl} style={{ maxHeight: '200px' }}>
                      </img>
                    }
                    {message.type === 'video'
                    && <video controls src={message.mediaUrl} style={{ maxHeight: '200px' }}>
                      </video>
                    }
                    {message.type === 'audio'
                    && <audio controls src={message.mediaUrl} style={{ maxHeight: '200px' }}>
                      </audio>
                    }
                  </div>
                  <div>
                    {message.seen ? 'seen' : 'delivered'}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
      <div id="messagingModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <div>
            <label>
              {'Send to: '}
            </label>
            <select name="dstUsers" id="dstUsers">
              {users.map((user, index) => (
                user.username !== thisUser
                  && <option key={index} value={user.username}>
                    {user.username}
                  </option>
              ))}
            </select>
          </div>
          <button onClick={() => setMessageType('text')} style={{ backgroundColor: messageType === 'text' && 'yellow' }}>
            Text
          </button>
          <button onClick={() => setMessageType('image')} style={{ backgroundColor: messageType === 'image' && 'yellow' }}>
            Image
          </button>
          <button onClick={() => setMessageType('audio')} style={{ backgroundColor: messageType === 'audio' && 'yellow' }}>
            Audio
          </button>
          <button onClick={() => setMessageType('video')} style={{ backgroundColor: messageType === 'video' && 'yellow' }}>
            Video
          </button>
          {messageType === 'text'
            && <textarea id={'text'}></textarea>
          }
          {messageType === 'image'
            && <input onChange={(e) => { setImage(e.target.files[0]); }} id={'image-upload'} type="file" accept='.png,.jpg,.jpeg'/>
          }
          {messageType === 'audio'
            && <input onChange={(e) => { setAudio(e.target.files[0]); }} id={'audio-upload'} type="file" accept='.mp3,.wav,.aac'/>
          }
          {messageType === 'video'
            && <input onChange={(e) => { setVideo(e.target.files[0]); }} id={'video-upload'} type="file" accept='.mp4,.mpeg,.mov'/>
          }
          <button style={{ width: '15%' }} onClick={sendMessage} id={'sendMsgBtn'}>
            Send Message
          </button>

        </div>
      </div>
    </div>
  );
};

export default Messaging;
