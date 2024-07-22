import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ChatInput from './ChatInput';
import Logout from './Logout';
import { v4 as uuidv4 } from 'uuid';
import { sendMessageRoute, receiveMessageRoute } from '../utils/APIRoutes';
import IconButton from '@mui/material/IconButton';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Badge, Avatar } from '@mui/material';

const GreenCallIcon = styled(CallIcon)`
  color: #FF0F4F;
`;

const RedVideocamIcon = styled(VideocamIcon)`
  color: #FF0F4F;
`;

export default function ChatContainer({ currentChat, socket, startVoiceCall, startVideoCall }) {
  const [messages, setMessages] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [avatarSrc, setAvatarSrc] = useState('');
  const [username, setUsername] = useState('');
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        const response = await axios.post(receiveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentChat) {
      fetchMessages();
      setAvatarSrc(currentChat.avatarImage);
      setUsername(currentChat.username);
    }
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        try {
          const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
          return data._id;
        } catch (error) {
          console.error("Error fetching current chat:", error);
        }
      }
    };
    getCurrentChat();
  }, [currentChat]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-receive', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
        console.log(msg);
      });
    }
  }, [socket, currentChat]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket.current) {
      socket.current.emit('add-user', JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id);
      socket.current.on('get-users', (users) => {
        const onlineUsers = users.map(user => user.userId);
        setIsUserOnline(onlineUsers.includes(currentChat._id));
      });
    }
  }, [socket, currentChat]);

  const handleSendMsg = async (msg) => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit('send-msg', {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  const handleUsernameClick = () => {
    setShowProfile(prev => !prev);
  };

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <span style={{ backgroundColor: isUserOnline ? 'green' : 'red', borderRadius: '50%', width: '10px', height: '10px' }} />
            }
          >
            <Avatar src={`data:image/svg+xml;base64,${avatarSrc}`} alt="avatar" className="profile-avatar" />
          </StyledBadge>
          <div className="username" onClick={handleUsernameClick} style={{ cursor: 'pointer' }}>
            <h3>{username}</h3>
            <p style={{
              marginTop: '5px',
              color: isUserOnline ? 'green' : 'red',
              fontSize: '0.8rem'
            }}>
              {isUserOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="call-buttons">
          <IconButton onClick={startVoiceCall}>
            <GreenCallIcon />
          </IconButton>
          <IconButton onClick={startVideoCall}>
            <RedVideocamIcon />
          </IconButton>
        </div>
        <Logout />
      </div>
      {showProfile && (
        <div className="profile-display">
          <img
            src={`data:image/svg+xml;base64,${avatarSrc}`}
            alt="avatar"
            className="profile-avatar"
          />
          <p>{currentChat.username}</p>
          <p>{currentChat.email}</p>
          {/* Add more user details as needed */}
        </div>
      )}
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '.MuiBadge-dot': {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
}));

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #333;
    color: white;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
        }
      }
      .username {
        h3 {
          margin: 0;
        }
      }
    }
    .call-buttons {
      display: flex;
      gap: 0.5rem;
    }
  }
  .profile-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #f0f0f0;
    border-radius: 10px;
    margin: 1rem;
    img.profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    p {
      margin: 0;
      color: #333;
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
