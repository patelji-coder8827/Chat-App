import React from 'react';
import './rightsidebar.css';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Rightside = ({ selectedUser, onlineUsers, messages }) => {
    const navigate = useNavigate();

    if (!selectedUser) {
        return null;
    }

    
    const isOnline = onlineUsers ? onlineUsers.has(String(selectedUser.id)) : false;

     
    const userMedia = messages.filter(
        (msg) =>
            msg.image &&
            (String(msg.senderId) === String(selectedUser.id) ||
                String(msg.receiverId) === String(selectedUser.id))
    );

    return (
        <div className="rightside">

            <div className='right-sidebar'>
                <div className='user2'>
                    <img className='user-ava' src={selectedUser.profilePic || assets.avatar_icon} alt="User Avatar" />
                    <div className='user-det'>
                        
                        <p className={isOnline ? 'green-color' : 'gray-color'}>{isOnline ? 'Online' : 'Offline'}</p>
                        <h2 className='user-names'>{selectedUser.FullName}</h2>
                    </div>
                </div>

                <div className='separator'></div>

                <div className='user-bio-section'>
                    <h3>About</h3>
                    <p className='user-bio'>{selectedUser.bio}</p>
                </div>

                <div className='separator'></div>

                <div className='media-section'>
                    <h3>Media</h3>
                    <div className='media-gallery'>
                        {userMedia.length > 0 ? (
                            userMedia.map((msg, index) => (
                                <div key={msg.id || index} onClick={() => window.open(msg.image)}>
                                    <img src={msg.image} alt={`Media ${index}`} className='media-item' />
                                </div>
                            ))
                        ) : (
                            <p className='no-media-message'>No media shared yet.</p>
                        )}

                    </div>
                </div>

                <div className='logout-button-container'>
                    <button className='logout-button' onClick={() => navigate('/')}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default Rightside;