import React, { useState } from 'react';
import { Drawer, List, IconButton, Divider, Box, styled } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faCaretLeft, faCaretRight, faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
// Import axios for API calls

const drawerWidth = 350; // Adjust the width as needed

const StyledIconButton = styled(IconButton)(({ theme, drawerOpen, anchor }) => ({
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    [anchor === 'left' ? 'left' : 'right']: drawerOpen ? `${drawerWidth - 5}px` : '20px',
    backgroundColor: '#1976d2',
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: `${anchor === 'left' ? 'left' : 'right'} 0.2s ease-in-out`,
    '&:hover': {
        backgroundColor: '#1565c0',
    },
}));

const heading = {
    color: 'black',
    fontSize: '24px',
    padding: '10px',
    textAlign: 'center',
};

const heading2 = {
    color: 'black',
    fontSize: '18px',
    padding: '10px',
    textAlign: 'center',
};

const colorData = [
    { id: 1, color: '#FF5733', text: 'Text for Color 1' },
    { id: 2, color: '#FFC300', text: 'Text for Color 2' },
    { id: 3, color: '#DAF7A6', text: 'Text for Color 3' },
    { id: 4, color: '#7FB3D5', text: 'Text for Color 4' },
    { id: 5, color: '#C39BD3', text: 'Text for Color 5' },
    { id: 6, color: '#F1948A', text: 'Text for Color 6' },
    { id: 7, color: '#73C6B6', text: 'Text for Color 7' },
    { id: 8, color: '#F0B27A', text: 'Text for Color 8' },
    { id: 9, color: '#85C1E9', text: 'Text for Color 9' },
    { id: 10, color: '000000', text: 'Text for Color 10' },
];

const SidebarMenu = ({ open, onClose, onSelectColor, onSelectWallpaper }) => {
    const [drawerOpen, setDrawerOpen] = useState(open);
    const [anchor, setAnchor] = useState('right');
   
    const [isFullScreen, setIsFullScreen] = useState(false);

   

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        onClose();
    };

    const toggleAnchor = (newAnchor) => {
        setAnchor(newAnchor);
        setDrawerOpen(false);
        setTimeout(() => {
            setDrawerOpen(true);
        }, 300);
    };

    const selectColor = (color) => {
        const selectedColor = colorData.find(item => item.color === color);
        if (selectedColor) {
            onSelectColor(selectedColor); // Pass selected color data to parent component
        }
    };

   

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullScreen(false);
        }
    };

    return (
        <React.Fragment>
            <StyledIconButton drawerOpen={drawerOpen} anchor={anchor} onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}>
                <FontAwesomeIcon icon={faSliders} style={{ color: 'white', fontSize: 24 }} />
            </StyledIconButton>
            <Drawer
                anchor={anchor}
                open={drawerOpen}
                onClose={handleDrawerClose}
                variant="persistent"
                sx={{ width: drawerWidth, flexShrink: 0 }}
                PaperProps={{ style: { width: drawerWidth } }}
            >
                <List>
                    <h2 style={heading}>Settings</h2>
                    <Divider />
                    <Box marginTop="20px" marginBottom="20px" display="flex" justifyContent="space-around" padding="10px">
                        <Box border="1px solid #ccc" borderRadius="10px" padding="5px">
                            <IconButton onClick={() => toggleAnchor('left')}>
                                <FontAwesomeIcon icon={faCaretLeft} style={{ color: 'black', fontSize: 24 }} />
                            </IconButton>
                        </Box>
                        <Box border="1px solid #ccc" borderRadius="10px" padding="5px">
                            <IconButton onClick={() => toggleAnchor('right')}>
                                <FontAwesomeIcon icon={faCaretRight} style={{ color: 'black', fontSize: 24 }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider />
                    <h4 style={heading2}>Theme</h4>
                    <Box marginTop="20px" marginBottom="20px" display="flex" flexWrap="wrap" justifyContent="space-around" padding="10px">
                        {colorData.map(color => (
                            <Box
                                key={color.id}
                                border="1px solid #ccc"
                                borderRadius="10px"
                                padding="5px"
                                onClick={() => selectColor(color.color)}
                                style={{ cursor: 'pointer', marginBottom: '10px', width: '30%', textAlign: 'center' }}
                            >
                                <div
                                    style={{
                                        backgroundColor: color.color,
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '10px',
                                        margin: 'auto',
                                    }}
                                ></div>
                            </Box>
                        ))}
                    </Box>
                   
                    
                    <Divider />
                    <Box display="flex" justifyContent="center" padding="10px">
                        <IconButton onClick={toggleFullScreen} style={{ color: 'black', fontSize: 24 }}>
                            <FontAwesomeIcon icon={isFullScreen ? faCompress : faExpand} />
                        </IconButton>
                        <span style={{ marginLeft: '10px', fontSize: '18px', marginTop:'11px' }}>
                            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                        </span>
                    </Box>
                </List>
            </Drawer>
        </React.Fragment>
    );
};

export default SidebarMenu;
