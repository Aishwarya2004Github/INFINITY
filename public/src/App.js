import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu';
import SetAvatar from './components/SetAvatar';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import VoiceCallPage from './pages/VoiceCallPage';
import VideoCallPage from './pages/VideoCallPage';

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <BrowserRouter>
            <div>
                <SidebarMenu open={sidebarOpen} onClose={handleSidebarClose} />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/setAvatar" element={<SetAvatar />} />
                    <Route path="/voicecall" element={<VoiceCallPage />} />
                    <Route path="/videocall" element={<VideoCallPage />} />
                    <Route path="/" element={<Chat />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
