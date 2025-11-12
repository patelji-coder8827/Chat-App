import React from 'react';
import './SidebarOption.css';

const SidebarOptions = ({ handleViewChange }) => {
  return (
    <div className="sidebar-options1">
      <div className="option1" onClick={() => handleViewChange('chat')}>
        <span role="img" aria-label="Chat">
          💬
        </span>
        <p>Chat</p>
      </div>
      <div className="option1" onClick={() => handleViewChange('status')}>
        <span role="img" aria-label="Status">
          🟢
        </span>
        <p>Status</p>
      </div>
      <div className="option1" onClick={() => handleViewChange('setting')}>
        <span role="img" aria-label="Settings">
          ⚙️
        </span>
        <p>Settings</p>
      </div>
    </div>
  );
};

export default SidebarOptions;