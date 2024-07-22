import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Switch from '@mui/material/Switch';
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faBoxArchive, faCircleNotch } from '@fortawesome/free-solid-svg-icons';



const lightTheme = {
  body: "#f0f0f0",
  backgroundImage: "linear-gradient(45deg, #FF6F91, #FF9671, #FFC75F, #F9F871)",
  containerBackground: "#00000076",
  switchWidth: 40,
  switchHeight: 40,
  switchBackgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
    '#fff'
  )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
};

const darkTheme = {
  body: "#121212",
  backgroundColor: "#333333",
  containerBackground: "#444444",
  switchWidth: 40,
  switchHeight: 40,
  switchBackgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
    '#fff',
  )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
};

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [theme, setTheme] = useState(lightTheme);
  const [checked, setChecked] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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

  const handleThemeChange = (event) => {
    setChecked(event.target.checked);
    setTheme(event.target.checked ? darkTheme : lightTheme);
  };
  

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Sidebar>
          <div className="theme-toggle">
            <Switch
              checked={checked}
              onChange={handleThemeChange}
              inputProps={{ 'aria-label': 'controlled' }}
              icon={<FontAwesomeIcon icon={faSun} style={{ color: '#FFD700' }} />} // Icon for unchecked state (light mode) with gold color
  checkedIcon={<FontAwesomeIcon icon={faMoon} style={{ color: '#4B0082' }} />} 
            />
          </div>
          <div className="sidebar-content">
            <h2 onClick={handleDrawerToggle} className="username">
              {currentUser?.username || 'Username'}
            </h2>
            <Divider sx={{ bgcolor: 'black',height:'2px', padding: '0px 10px', marginBottom:'20px' }} />
            <ul>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
  <FontAwesomeIcon 
    icon={faBoxArchive} 
    style={{ marginRight: '10px', fontSize: '20px', color: '#4A90E2' }} // Adjust the margin to add space
  />
  <Link 
    to="/ArchivedChats" 
    style={{ textDecoration: 'none', color: '#333', fontSize: '16px' }}
  >
    Archive Chat
  </Link>
</li>
<li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
  <FontAwesomeIcon 
    icon={faCircleNotch} 
    style={{ marginInlineStart: '10px', fontSize: '20px', color: '#E94E77' }} // Adjust the margin to add space
  />
  <Link 
    to="/Status" 
    style={{ textDecoration: 'none', color: '#333', fontSize: '16px', marginLeft: '10px' }}
  >
    Status
  </Link>
</li>
            </ul>
          </div>
        </Sidebar>
        <DrawerContainer open={drawerOpen} onClose={handleDrawerToggle}>
          <div className="drawer-header">
            <button onClick={handleDrawerToggle} className="close-btn">
              <CloseIcon />
            </button>
          </div>
          <div className="profile-header">
            <img
              src={
                currentUser?.avatarImage
                  ? `data:image/svg+xml;base64,${currentUser.avatarImage}`
                  : 'default-avatar.png'
              }
              alt="Avatar"
              className="avatar"
            />
            <div className="profile-info">
              <h2>{currentUser?.username}</h2>
              <p>Email: {currentUser?.email}</p>
              {/* Add more user details if needed */}
            </div>
          </div>
        </DrawerContainer>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
         
        </div>
      </Container>
    </ThemeProvider>
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
    background-image: linear-gradient(45deg, #FF6F91, #FF9671, #FFC75F, #F9F871);
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    color: ${(props) => props.theme.body};
  }
`;

const Sidebar = styled.div`
  width: 230px;
  background-color: ${(props) => props.theme.containerBackground};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.3);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;

  .theme-toggle {
    margin-bottom: 1rem;
  }

  .sidebar-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    h2 {
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 1rem;

        a {
          text-decoration: none;
          color: ${(props) => props.theme.body};
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

const DrawerContainer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 300px;
    background-color: ${(props) => props.theme.containerBackground};
    display: flex;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  }

  .drawer-header {
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;
  }

  .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${(props) => props.theme.body};
    font-size: 24px;
  }

  .profile-header {
    display: flex;
    align-items: center;
    padding: 1rem;
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 16px;
    object-fit: cover; /* Ensure the image fits the container without distortion */
    border: 2px solid #ccc; /* Optional: Add a border for better visibility */
  }

  .profile-info {
    display: flex;
    flex-direction: column;

    h2 {
      margin: 0;
      font-size: 20px;
      color:#FF0F4F;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: white;
    }
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
  background-color: ${(props) => props.theme.backgroundColor};

  .theme-toggle {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .container {
    height: 100vh;
    width: 85vw;
    background-color: ${(props) => props.theme.containerBackground};
    display: grid;
    position:relative;
    left:115px;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }

  .MuiSwitch-root {
    height: 50px;
    width: 60px;
  }
 h2 {
      margin-bottom: 1rem;
      color: #FF0F4F;  /* Add your desired color here */
      cursor: pointer;  /* Add cursor pointer for better UX */
    }
  .MuiSwitch-switchBase {
    background-image: ${(props) => props.theme.switchBackgroundImage};
    width: ${(props) => props.theme.switchWidth}px;
    height: ${(props) => props.theme.switchHeight}px;
  }
`;
