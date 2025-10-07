import React, { useState, useEffect, useRef } from 'react';
import assets from '../assets/assets';
import Send from '../assets/send.png'
import './Status.css';

const Status = ({ loggedInUser, userList }) => {
    const [allStatuses, setAllStatuses] = useState([]);
    const [statusFile, setStatusFile] = useState(null);
    const [statusText, setStatusText] = useState('');
    const fileInputRef = useRef(null);
    const videoDurationLimit = 30;


    const [viewingUserStatuses, setViewingUserStatuses] = useState([]);
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/statuses');
                const data = await response.json();
                const filteredStatuses = data.statuses.filter(status => {
                    const statusTime = new Date(status.timestamp);
                    const now = new Date();
                    return now - statusTime <= 24 * 60 * 60 * 1000;
                });
                setAllStatuses(filteredStatuses);
            } catch (error) {
                console.error('Failed to fetch statuses:', error);
            }
        };
        fetchStatuses();
        const interval = setInterval(fetchStatuses, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileType = file.type.split('/')[0];
        if (fileType === 'video') {
            const tempVideo = document.createElement('video');
            tempVideo.preload = 'metadata';
            tempVideo.onloadedmetadata = () => {
                window.URL.revokeObjectURL(tempVideo.src);
                if (tempVideo.duration > videoDurationLimit) {
                    alert('Video must be 30 seconds or less.');
                    setStatusFile(null);
                    e.target.value = null;
                } else {
                    setStatusFile(file);
                }
            };
            tempVideo.src = URL.createObjectURL(file);
        } else if (fileType === 'image') {
            setStatusFile(file);
        } else {
            alert('Only images and videos are allowed.');
            setStatusFile(null);
            e.target.value = null;
        }
    };

    const handleAddStatus = async () => {
        if (!statusFile && !statusText.trim()) return;

        const formData = new FormData();
        formData.append('userId', loggedInUser.id);
        if (statusFile) formData.append('statusMedia', statusFile);
        if (statusText.trim()) formData.append('text', statusText.trim());

        try {
            const response = await fetch('http://localhost:5000/api/statuses', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setAllStatuses(prev => [data.status, ...prev]);
                setStatusFile(null);
                setStatusText('');
                if (fileInputRef.current) fileInputRef.current.value = null;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Failed to add status:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handlePlusClick = () => {
        setStatusFile(null);
        setStatusText('');
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
            fileInputRef.current.click();
        }
    };

    const handleDeleteStatus = async (statusId) => {
        if (!window.confirm('Are you sure you want to delete this status?')) return;
        try {
            const response = await fetch(`http://localhost:5000/api/statuses/${statusId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: loggedInUser.id }),
            });
            const data = await response.json();
            if (response.ok) {
                setAllStatuses(prev => prev.filter(s => s.id !== statusId));
                setViewerOpen(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Failed to delete status:', error);
            alert('Error deleting status.');
        }
    };

    const getStatusForUser = (userId) => {
        return allStatuses
            .filter(status => String(status.user_id) === String(userId))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `Today at ${hours}:${minutes}`;
    };

    const otherUsersWithStatuses = userList.filter(user => getStatusForUser(user.id).length > 0);


    const openStatusViewer = (statusList, startIndex) => {
        setViewingUserStatuses(statusList);
        setCurrentStatusIndex(startIndex);
        setViewerOpen(true);
    };

    const handleViewerClick = (status) => {
        const userStatuses = getStatusForUser(status.user_id);
        const startIndex = userStatuses.findIndex(s => s.id === status.id);
        openStatusViewer(userStatuses, startIndex);
    };

    const handleNextStatus = () => {
        if (currentStatusIndex < viewingUserStatuses.length - 1) {
            setCurrentStatusIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePreviousStatus = () => {
        if (currentStatusIndex > 0) {
            setCurrentStatusIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleReply = () => {
        if (replyText.trim()) {
            console.log(`Sending reply "${replyText}" to status from user ${viewingUserStatuses[currentStatusIndex].user_id}`);
            setReplyText('');

        }
    };

    const currentStatus = viewingUserStatuses[currentStatusIndex];
    const viewingUser = currentStatus ? userList.find(u => u.id === currentStatus.user_id) : null;

    return (
        <div className='status-container'>
            <div className="status-header-bar">
                <h2>Status</h2>
                <div className="status-actions">
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        name="statusMedia"
                        ref={fileInputRef}

                    />
                    <span className="icon-btn" onClick={handlePlusClick}>
                        <i className="fa-solid fa-plus-circle">+</i>
                    </span>

                    <input
                        type="text"
                        value={statusText}
                        onChange={e => setStatusText(e.target.value)}
                        placeholder="Type a status..."
                        className="status-text-input"
                    />

                    <button
                        onClick={handleAddStatus}
                        disabled={!statusFile && statusText.trim() === ''}
                        className="status-post-btn"
                    >
                        Post
                    </button>
                </div>
            </div>

            <div className='my-status' onClick={() => {
                const myStatuses = getStatusForUser(loggedInUser.id);
                if (myStatuses.length > 0) {
                    openStatusViewer(myStatuses, myStatuses.length - 1);
                } else {
                    handlePlusClick();
                }
            }}>
                <div className='status-user-info'>
                    <div className="status-avatar-wrapper">
                        <img src={loggedInUser.profilePic || assets.avatar_icon} alt="My Profile"
                        accept="image/*,video/*"
                            onChange={handleFileChange}
                            name="statusMedia"
                        />
                        <span className="add-status-icon" onClick={handlePlusClick}>
                            <i className="fa-solid fa-plus">+</i>
                        </span>
                    </div>
                    <div>
                        <p className='user-name'>My status</p>
                        <p className='last-update'>Tap to add status update</p>
                    </div>
                </div>
            </div>

            <div className='recent-statuses'>
                <h4>Recent</h4>
                {otherUsersWithStatuses.length > 0 ? (
                    otherUsersWithStatuses.map(user => {
                        const latestStatus = getStatusForUser(user.id)[getStatusForUser(user.id).length - 1];
                        return (
                            <div key={user.id} className='user-status-item' onClick={() => handleViewerClick(latestStatus)}>
                                <div className='status-user-info'>
                                    <div className="status-avatar-wrapper">
                                        <img src={user.profilePic || assets.avatar_icon} alt={user.FullName} />
                                    </div>
                                    <div>
                                        <p className='user-name'>{user.FullName}</p>
                                        <p className='status-time'>{formatTime(latestStatus.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="no-statuses-message">No recent statuses to show.</p>
                )}
            </div>

            {viewerOpen && currentStatus && (
                <div className="status-viewer-overlay">
                    <div className="status-viewer-content">

                        <div className="status-progress-bar">
                            {viewingUserStatuses.map((_, index) => (
                                <div
                                    key={index}
                                    className={`progress-segment ${index === currentStatusIndex ? 'active' : ''}`}
                                    style={{
                                        animationDuration: `${currentStatus.media?.endsWith('.mp4') ?
                                            document.querySelector('video')?.duration || 5 : 5}s`
                                    }}
                                ></div>
                            ))}
                        </div>


                        <div className="status-viewer-header">
                            <span className='close-btn' onClick={() => setViewerOpen(false)}>&times;</span>
                            <div className="viewer-user-info">
                                <img src={viewingUser?.profilePic || assets.avatar_icon} alt={viewingUser?.FullName} className="viewer-user-avatar" />                                <div className="viewer-text-info">
                                    <p className="viewer-user-name">{viewingUser?.FullName}</p>
                                    <p className="viewer-status-time">{formatTime(currentStatus.timestamp)}</p>
                                </div>
                            </div>
                            <span className="viewer-options">

                            </span>
                        </div>

                        <div className="status-media-container">
                            {currentStatus.media ? (
                                currentStatus.media.endsWith('.mp4') ? (
                                    <video autoPlay controls src={`http://localhost:5000${currentStatus.media}`} />
                                ) : (
                                    <img src={`http://localhost:5000${currentStatus.media}`} alt="Status media" />
                                )
                            ) : (
                                <div className="status-text-content">
                                    <p>{currentStatus.text}</p>
                                </div>
                            )}
                        </div>


                        <div className="status-navigation">
                            <button className="nav-btn prev-btn" onClick={handlePreviousStatus} disabled={currentStatusIndex === 0}>&lt;</button>
                            <button className="nav-btn next-btn" onClick={handleNextStatus} disabled={currentStatusIndex === viewingUserStatuses.length - 1}>&gt;</button>
                        </div>


                        <div className="status-reply-input">
                            <input
                                type="text"
                                placeholder="Type a reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <button onClick={handleReply} >
                                <img className='send-icon' src={Send} alt="Send" />
                            </button>
                        </div>

                        {currentStatus.user_id === loggedInUser.id && (
                            <button className='delete-status-btn' onClick={() => handleDeleteStatus(currentStatus.id)}>Delete</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Status;