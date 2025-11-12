import React, { useState, useRef, useEffect } from 'react';
import assets from '../assets/assets';
import './ChatUI.css';
import { socket } from '../socket';
import arrow1 from '../assets/arrow1.png'
import happy from '../assets/happy.png'
import Picker from "emoji-picker-react";
import Down from '../assets/down-arrow (1).png'
import copy from '../assets/copy.png';
import Delete from '../assets/Delete.png'


const ChatUI = ({ selectedUser, setSelectedUser, onlineUsers, messages, setMessages, useCallback }) => {
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const currentUserId = localStorage.getItem('userId');
    const chatAreaRef = useRef();
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef(null);
    const [showMessageId, setShowMessageId] = useState(null);
    const [deleteOptionsModal, setDeleteOptionsModal] = useState(null);
    const [reactingToMessageId, setReactingToMessageId] = useState(null);




    const handleCopy = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setShowMessageId(null);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const copyImageUrl = async (imageUrl) => {
        try {
            const copidImage = await fetch(imageUrl);
            const blobData = await copidImage.blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blobData.type]: blobData
                })
            ]);
            setShowMessageId(null)
            alert('Image copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy image: ', error);
            navigator.clipboard.writeText(imageUrl).then(() => {
                alert('Could not copy image, copied URL instead.');
            });
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        });
    };

    const onEmojiClick = (emojiData) => {
        const emoji = emojiData.emoji;
        const input = inputRef.current;

        if (!input) {
            console.error("Input ref is not set");
            return;
        }

        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;
        const updated = newMessage.slice(0, start) + emoji + newMessage.slice(end);
        setNewMessage(updated);
    };


    const scrollToBottom = (behavior = 'smooth') => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTo({
                top: chatAreaRef.current.scrollHeight,
                behavior: behavior
            });
        }
    };

    const handleScroll = () => {
        const chatArea = chatAreaRef.current;
        if (chatArea) {
            const scrollOffset = chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight;
            setShowScrollButton(scrollOffset > 50);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            const chatArea = chatAreaRef.current;
            if (chatArea) {
                const isNearBottom = chatArea.scrollHeight - chatArea.scrollTop - chatArea.clientHeight < 150;
                if (isNearBottom) {
                    scrollToBottom('smooth');
                }
            }
        }
    }, [messages]);


    useEffect(() => {
        const chatArea = chatAreaRef.current;
        if (chatArea) {
            chatArea.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (chatArea) {
                chatArea.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target.result);
            };
            reader.readAsDataURL(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const sendMessage = () => {
        if (newMessage.trim() === '' && !selectedImage) {
            return;
        }
        const tempId = Date.now().toString() + Math.random();
        const msg = {
            senderId: currentUserId,
            receiverId: selectedUser.id,
            text: newMessage,
            image: selectedImage,
            createdAt: new Date().toISOString(),
            tempId: tempId
        };
        setMessages(prevMessages => [...prevMessages, msg]);
        socket.emit('message', msg);
        console.log('message', msg)

        setNewMessage('');
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleDelete = (messageId, deleteType) => {
        socket.emit('deleteMessage', {
            messageId,
            deleteType,
        });


        setDeleteOptionsModal(null);
        setShowMessageId(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const isSelectedUserOnline = selectedUser && onlineUsers ? onlineUsers.has(String(selectedUser.id)) : false;

    return selectedUser ? (
        <div className="chat-ui">
            {deleteOptionsModal && (() => {
                const messageToDelete = messages.find(m => (m.id || m.tempId) === deleteOptionsModal.messageId);
                const isSender = messageToDelete ? String(messageToDelete.senderId) === String(currentUserId) : false;

                return (
                    <div className="confirmation-modal-overlay" onClick={() => setDeleteOptionsModal(null)}>
                        <div className="delete-options-modal" onClick={(e) => e.stopPropagation()}>
                            {isSender ? (
                                <> 
                                    <button className="modal-option-btn delete-everyone"
                                        onClick={() => handleDelete(deleteOptionsModal.messageId, 'forEveryone')}>
                                        Delete for Everyone
                                    </button>
                                    <button className="modal-option-btn"
                                        onClick={() => handleDelete(deleteOptionsModal.messageId, 'forMe')}>
                                        Delete for Me
                                    </button>
                                </>
                            ) : (
                                <button className="modal-option-btn"
                                    onClick={() => handleDelete(deleteOptionsModal.messageId, 'forMe')}>
                                    Delete for Me
                                </button>
                            )}
                            <button className="modal-option-btn cancel-btn"
                                onClick={() => setDeleteOptionsModal(null)}>Cancel</button>
                        </div>
                    </div>
                );
            })()}
            

            <div className='container'>
                <div className='profile-info'>
                    <img onClick={() => setSelectedUser(null)} className='arrow-icon' src={assets.arrow_icon} alt="arrow" />
                    <img className='profile-icon' src={selectedUser.profilePic || assets.avatar_icon} alt="profile-icon" />
                    <p className='user-name'>
                        {selectedUser.FullName}
                        <span className={isSelectedUserOnline ? 'online' : 'offline'}>
                            {isSelectedUserOnline ? 'Online' : 'Offline'}
                        </span>
                    </p>
                    <img className='help-icon' src={assets.help_icon} alt="help" />
                </div>

                <div className='chat-area'>
                    <div className='messages' ref={chatAreaRef} onScroll={handleScroll}>
                        {messages.map((msg) => {
                            const isSent = String(msg.senderId) === String(currentUserId);
                            const messageId = msg.id || msg.tempId;
                            return (
                                <div
                                    key={messageId}
                                    className={`message-row ${isSent ? 'sent' : 'received'}`}
                                >
                                    <div className='message-meta'>
                                        <img className='user-avatar' src={isSent ? assets.avatar_icon : selectedUser.profilePic || assets.avatar_icon}
                                            alt="User Avatar" />
                                        <p className='timestamp'>
                                            {msg.createdAt ? formatTime(msg.createdAt) : ''}
                                        </p>
                                    </div>

                                    {msg.isDeleted ? (
                                        <div className={`message-content message-deleted ${isSent ? 'sent' : 'received'}`}>
                                            <em>🚫 This message was deleted</em>
                                        </div>
                                    ) : msg.image ? (
                                        <div className={`message-content message-image-wrapper ${isSent ? 'sent' : 'received'}`}>
                                            <img
                                                className="message-image"
                                                src={msg.image}
                                                alt="Message content"
                                                onError={e => { e.currentTarget.src = assets.image_placeholder || '/fallback.png'; }}
                                            />

                                            <img
                                                src={Down}
                                                alt="options"
                                                className="action-icon"
                                                onClick={() => setShowMessageId(showMessageId === messageId ? null : messageId)}
                                            />
                                            {showMessageId === messageId && (
                                                <div className="options-menu">
                                                    <div className="option-item" onClick={() => copyImageUrl(msg.image)} i>
                                                        <img className='imggg' src={copy} alt="copy" />Copy</div>
                                                    <div className="option-item" onClick={() => setDeleteOptionsModal({ messageId })}>
                                                        <img className='imggg' src={Delete} alt="delete" />Delete</div>
                                                </div>
                                            )}

                                        </div>
                                    ) : (
                                        <div className={`message-content message-text ${isSent ? 'sent' : 'received'}`}>
                                            <span className='message-text' style={{ wordBreak: 'break-word', flex: '1' }}>{msg.text}</span>
                                            <img
                                                src={Down}
                                                alt="options"
                                                className="action-icon"
                                                onClick={() => setShowMessageId(showMessageId === messageId ? null : messageId)}
                                            />
                                            {showMessageId === messageId && (
                                                <div className="options-menu">
                                                    <div className="option-item" onClick={() => handleCopy(msg.text)}>
                                                        <img className='imggg' src={copy} alt="" />Copy</div>
                                                    <div className="option-item" onClick={() => setDeleteOptionsModal({ messageId })}>
                                                        <img className='imggg' src={Delete} alt="" />Delete</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <img
                                        className='happy1'
                                        src={happy}
                                        alt="add reaction"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div
                        className={`chatdown-arrow ${showScrollButton ? 'show' : ''}`}
                        onClick={() => scrollToBottom('smooth')}
                    >
                        <img src={arrow1} alt="logo" />
                    </div>
                </div>

                <div className='input-area'>
                    <div className='emoji' onClick={() => setShowEmojiPicker(val => !val)}>
                        <img src={happy} alt="icon" style={{ cursor: "pointer" }} />
                    </div>
                    {showEmojiPicker && (
                        <div className="emoji-picker-popup">
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                    <div className='input-container'>
                        {imagePreview && (
                            <div className="image-preview-container">
                                <span className="remove-image" onClick={() => { setSelectedImage(null); setImagePreview(null); }}>X</span>
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            </div>
                        )}
                        <input

                            ref={inputRef}
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <input type="file" id='file-upload' accept='image/*' onChange={handleImageChange} style={{ display: 'none' }} />
                        <label htmlFor="file-upload" className='file-upload-label'>
                            <img src={assets.gallery_icon} alt="Attach" />
                        </label>
                    </div>
                    <img onClick={sendMessage} src={assets.send} alt="Send" />
                </div>
            </div>
        </div >
    ) : (
        <div className='welcome-screen'>
            <img src={assets.logo_icon} alt="logo" />
            <p className='welcome-message'>Chat Anytime</p>
        </div>
    );
};

export default ChatUI;