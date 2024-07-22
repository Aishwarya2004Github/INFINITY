import React, { useState } from 'react';
import { Button, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  height: 100%; /* Ensures the container takes up the full height of the drawer */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  

  .drawer-header {
    display: flex;
    justify-content: flex-end;
    padding: 16px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }

  .close-btn {
    color: black; /* Ensure the close button icon is black or any other color that contrasts with the background */
  }

  .profile-content {
    flex: 1; /* Ensures the profile content takes up the remaining space */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background-color: #fff;


    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 16px;
      border: 2px solid #e0e0e0;
    }

    h3 {
      margin: 0;
      font-size: 1.5em;
      color: #333;
    }

    p {
      margin: 8px 0 0;
      font-size: 1em;
      color: #666;
    }

    .details {
      width: 100%;
      margin-top: 16px;
      text-align: left;

      .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
`;

const UserProfileDrawer = ({ user }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      {/* Button to open drawer */}
      <Button onClick={handleToggleDrawer} variant="outlined">
        {user.username}
      </Button>
      
      {/* Drawer component */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleToggleDrawer}
        PaperProps={{ style: { width: 300, height: '100%' } }} // Adjust width and height as needed
      >
        <ProfileContainer>
          <div className="drawer-header">
            <IconButton onClick={handleToggleDrawer} className="close-btn">
              <CloseIcon />
            </IconButton>
          </div>
          <div className="profile-content">
            <img src={user.avatarImage || 'default-avatar.png'} alt="avatar" />
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <div className="details">
              {/* Add more user details as needed */}
              <div className="detail-item">
                <span>Location</span>
                <span>{user.location || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>Joined</span>
                <span>{user.joined || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span>Status</span>
                <span>{user.status || 'N/A'}</span>
              </div>
            </div>
          </div>
        </ProfileContainer>
      </Drawer>
    </div>
  );
};

export default UserProfileDrawer;
