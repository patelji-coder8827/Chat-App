import React, { useState, useEffect } from 'react';
import './home.css';
import Sidebar from '../components/Sidebar';
import ChatUI from '../components/ChatUI';
import Rightside from '../components/Rightside';
import { socket } from '../socket';
import SidebarOptions from '../components/SidebarOptions';
import Status from '../components/Status';
import { useNavigate } from 'react-router-dom';
 

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const currentUserId = localStorage.getItem('userId');
    const [unreadCounts, setUnreadCounts] = useState({});
    const [view, setView] = useState('chat');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUsers = async () => {
            if (!currentUserId) {
                navigate('/signin');
                return;
            }

            try {
                const allUsersResponse = await fetch('http://localhost:5000/users');
                const allUsersData = await allUsersResponse.json();

                if (allUsersResponse.ok && allUsersData.users) {
                    const currentUser = allUsersData.users.find(user => String(user.id) === String(currentUserId));
                    setLoggedInUser(currentUser);
                    const otherUsers = allUsersData.users.filter(user => String(user.id) !== String(currentUserId));
                    setUserList(otherUsers);
                } else {
                    console.error("Failed to fetch user list.");
                }
            } catch (error) {
                console.error('Network Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, [currentUserId, navigate]);


    useEffect(() => {
        const fetchAllUsers = async () => {
            if (!currentUserId) {
                navigate('/signin');
                return;
            }

            try {
                const allUsersResponse = await fetch('http://localhost:5000/users');
                const allUsersData = await allUsersResponse.json();

                if (allUsersResponse.ok && allUsersData.users) {
                    const currentUser = allUsersData.users.find(user => String(user.id) === String(currentUserId));
                    setLoggedInUser(currentUser);
                    const otherUsers = allUsersData.users.filter(user => String(user.id) !== String(currentUserId));
                    setUserList(otherUsers);
                } else {
                    console.error("Failed to fetch user list.");
                }
            } catch (error) {
                console.error('Network Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, [currentUserId, navigate]);


    const handleViewChange = (newView) => {
        setView(newView);
        setSelectedUser(null);
    };

    useEffect(() => {
        if (selectedUser) {
            setUnreadCounts(prev => ({
                ...prev,
                [selectedUser.id]: 0
            }));
        }
    }, [selectedUser]);

    useEffect(() => {
        if (!currentUserId) return;
        socket.connect();
        socket.emit('registerUser', currentUserId);

        const onConnect = () => {
            console.log('WebSocket server connected');
            socket.emit('requestOnlineUsers');
        };
        const onOnlineUsersList = (userIds) => setOnlineUsers(new Set(userIds));
        const onUserStatus = (status) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                if (status.isOnline) {
                    newSet.add(status.userId);
                } else {
                    newSet.delete(status.userId);
                }
                return newSet;
            });
        };

        socket.on('connect', onConnect);
        socket.on('onlineUsersList', onOnlineUsersList);
        socket.on('userStatus', onUserStatus);

        return () => {
            socket.off('connect', onConnect);
            socket.off('onlineUsersList', onOnlineUsersList);
            socket.off('userStatus', onUserStatus);
            socket.disconnect();
        };
    }, [currentUserId]);

    useEffect(() => {
        if (!selectedUser) {
            setMessages([]);
            return;
        }

        const fetchChatData = async () => {
            try {
                const msgResponse = await fetch(`http://localhost:5000/messages/${currentUserId}/${selectedUser.id}`);
                const msgData = await msgResponse.json();
                if (msgResponse.ok) {
                    setMessages(msgData.messages);
                } else {
                    console.error('Failed to fetch messages:', msgData.message);
                }

                const userResponse = await fetch(`http://localhost:5000/user/${selectedUser.id}`);
                const userData = await userResponse.json();
                if (userResponse.ok) {
                    setSelectedUser(prevUser => ({ ...prevUser, bio: userData.user.bio }));
                } else {
                    console.error('Failed to fetch user bio:', userData.message);
                }
            } catch (error) {
                console.error('Network error while fetching chat data:', error);
            }
        };

        fetchChatData();
    }, [selectedUser, currentUserId]);

    useEffect(() => {
        const onMessage = (msg) => {
            setMessages(prevMessages => {
                const isMessageForCurrentChat =
                    (String(msg.senderId) === String(selectedUser?.id) && String(msg.receiverId) === String(currentUserId)) ||
                    (String(msg.senderId) === String(currentUserId) && String(msg.receiverId) === String(selectedUser?.id));

                if (isMessageForCurrentChat) {
                    const existingMessageIndex = prevMessages.findIndex(m => m.id === msg.id || m.tempId === msg.tempId);
                    if (existingMessageIndex > -1) {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[existingMessageIndex] = msg;
                        return updatedMessages;
                    }
                    return [...prevMessages, msg];
                }
                return prevMessages;
            });
            if (String(msg.senderId) !== String(selectedUser?.id)) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [msg.senderId]: (prev[msg.senderId] || 0) + 1
                }));
            }
        };


        const onMessageDeleted = ({ messageId, deleteType }) => {
            console.log(`Received messageDeleted event for messageId: ${messageId}, type: ${deleteType}`);
            if (deleteType === 'forEveryone') {

                setMessages(prev =>
                    prev.map(msg =>
                        (msg.id === messageId)
                            ? { ...msg, text: 'This message was deleted', image: null, isDeleted: true }
                            : msg
                    )
                );
            } else if (deleteType === 'forMe') {

                setMessages(prev => prev.filter(msg => msg.id !== messageId));
            }          
        };

        socket.on('message', onMessage);

        socket.on('messageDeleted', onMessageDeleted);

        return () => {
            socket.off('message', onMessage);

            socket.off('messageDeleted', onMessageDeleted);
        };
    }, [currentUserId, selectedUser]);

    return (
        <div className="home">
            <div className={`chat-container ${selectedUser || view === 'status' ? 'three-columns' : 'two-columns'}`}>
                <SidebarOptions handleViewChange={handleViewChange} />  
                <Sidebar
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    onlineUsers={onlineUsers}
                    unreadCounts={unreadCounts}
                    loggedInUser={loggedInUser}  
                    userList={userList} 
                />
                {view === 'chat' && selectedUser && (
                    <ChatUI
                        selectedUser={selectedUser}
                        setSelectedUser={setSelectedUser}
                        onlineUsers={onlineUsers}
                        messages={messages}
                        setMessages={setMessages}
                    />
                )}
                {view === 'status' && <Status loggedInUser={loggedInUser} userList={userList} />}
                {selectedUser && (
                    <Rightside
                        selectedUser={selectedUser}
                        onlineUsers={onlineUsers}
                        messages={messages}
                    />
                )}
            </div>
        </div>
    ); 
};

export default Home;