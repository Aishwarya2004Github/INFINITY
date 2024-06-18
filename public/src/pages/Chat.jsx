import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled, { createGlobalStyle } from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
        );
      }
    };
    fetchData();
    
  }, [navigate]);

  
  useEffect(() => {
    if (currentUser) {
      console.log('Connecting socket with user ID:', currentUser._id); // Log the user ID
      socket.current = io(host, {
        withCredentials: true,
      });
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);


  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        } else {
          navigate('/setAvatar');
        }
      }
    };

    fetchData();
  }, [currentUser, navigate]);
  const handleChatChange = (chat) => {
    
    setCurrentChat(chat);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color:  #FEDC56;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
