import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import './sidebar.css';
import Ankit from '../assets/Ankit.png';
import { socket } from '../socket';

const Sidebar = ({ selectedUser, setSelectedUser, unreadCounts, handleViewChange }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchAllUsers = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/signin');
        return;
      }

      try {
        const allUsersResponse = await fetch(`${BACKEND_URL}/users`);
        const allUsersData = await allUsersResponse.json();

        if (allUsersResponse.ok && allUsersData.users) {
          const currentUser = allUsersData.users.find(user => String(user.id) === String(userId));
          setLoggedInUser(currentUser);


          const otherUsers = allUsersData.users.filter(user => String(user.id) !== String(userId));
          setUserList(otherUsers);
          setAllUsers(otherUsers);

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
  }, [navigate]);



  useEffect(() => {
    socket.connect();
    socket.emit('registerUser', localStorage.getItem('userId'));
    socket.emit('requestOnlineUsers');

    socket.on('onlineUsersList', (userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    socket.on('userStatus', (status) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (status.isOnline) newSet.add(status.userId);
        else newSet.delete(status.userId);
        return newSet;
      });
    });

    return () => {
      socket.off('onlineUsersList');
      socket.off('userStatus');
      socket.disconnect();
    };
  }, []);


  

if (loading) {
  return <div className='sidebar'>Loading...</div>;
}

const handleSearchChange = (event) => {
  const query = event.target.value;
  setSearchQuery(query);

  if (query.length > 0) {
    const filtered = allUsers.filter((user) =>
      user.FullName.toLowerCase().includes(query.toLowerCase())
    );
    setUserList(filtered);
  } else {
    setUserList(allUsers);
  }
};



return (

  <div className='sidebar'>
    <div className='sidebar-content'>
      <img className='ankit' src={Ankit} alt="logo" />
      <h2 className='ardent'>ArdentChat</h2>
      <div className='menu-icon'>
        <img src={assets.menu_icon} alt="menu" />
        <div className='sidebar-options'>
          <p onClick={() => navigate('/profile')}>Edit Profile</p>
          <p onClick={() => navigate('/')}>Logout</p>
        </div>
      </div>
    </div>
    <div className='search-bar'>
      <img src={assets.search_icon} alt="Search" />
      <input type="text"
        placeholder='Search User'
        value={searchQuery}
        onChange={handleSearchChange}

      />
    </div>

    <div className='user-list' >
      {loggedInUser && (
        <div
          key={loggedInUser.id || 'loggedInUser'}
          onClick={() => setSelectedUser(loggedInUser)}
          className={`user-item ${selectedUser && String(selectedUser.id) === String(loggedInUser.id) ? 'selected' : ''}`}
        >
          <img className='user-avatar' src={loggedInUser.profilePic || assets.avatar_icon} alt={loggedInUser.FullName} />
          <div>
            <p className='user-name'>{loggedInUser.FullName}</p>

          </div>
        </div>
      )}

      {userList.map((user) => {
        const isOnline = onlineUsers.has(String(user.id));
        const hasUnread = unreadCounts[user.id] > 0 && (!selectedUser || String(selectedUser.id) !== String(user.id));
        return (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`user-item ${selectedUser && String(selectedUser.id) === String(user.id) ? 'selected' : ''} ${hasUnread ? 'unread-bg' : ''}`}
          >
            <img className='user-avatar' src={user.profilePic || assets.avatar_icon} alt={user.FullName} />
            <div>
              <p className='user-name'>{user.FullName}</p>
              <span className={isOnline ? 'online' : 'offline'}>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            {unreadCounts[user.id] > 0 ? (
              <span className="unread-badge">{unreadCounts[user.id]}</span>
            ) : null}

          </div>
        )
      })}


    </div>
  </div>
);
};

export default Sidebar;