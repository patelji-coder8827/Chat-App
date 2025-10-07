import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import Ankit from '../assets/ankit.png';
import { toast } from 'react-toastify';


function ProfilePage() {
    const [user, setUser] = useState({ fullName: '', bio: '', profilePic: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.error("User not authenticated. Redirecting to sign in.");
                navigate('/signin');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/user/${userId}`);
                const json = await response.json();

                if (response.ok) {
                    const fetchedUser = {
                        fullName: json.user.FullName || '',
                        bio: json.user.bio || '',
                        profilePic: json.user.profilePic || ''
                    };
                    setUser(fetchedUser);
                } else {
                    toast.error(json.message || "Failed to fetch user data.");
                }
            } catch (error) {
                console.error('Network Error:', error);
                toast.error("An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId || !isEditing) return;

        try {
            const response = await fetch(`http://localhost:5000/update-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    fullName: user.fullName,
                    bio: user.bio,
                    profilePic: user.profilePic,
                }),
            });

            const json = await response.json();
            if (response.ok) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                navigate('/home');
            } else {
                toast.error(json.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("An error occurred while saving. Please try again.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { 
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prevUser => ({ ...prevUser, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="signup-page">
            <div className="left-column">
                <img src={Ankit} alt="Ardent Chat Logo" className="logo" />
                <h1 className="logo-text">Ardent Chat</h1>
            </div>
            <div className="right-column">
                <div className="form-container profile-container">
                    <h2>Profile details</h2>
                    <form onSubmit={handleSave}>
                        <div className="profile-image-upload">
                            <label htmlFor="profile-image-input" className="profile-image-label">
                                <div className="profile-image-preview">
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt="Profile" className="profile-image" />
                                    ) : (
                                        <div style={{ width: '100px', height: '100px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
                                    )}
                                </div>
                                <span>upload profile image</span>
                            </label>
                            <input
                                id="profile-image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                value={user.fullName}
                                onChange={(e) => setUser(prevUser => ({ ...prevUser, fullName: e.target.value }))}
                                placeholder="Full Name"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                value={user.bio}
                                onChange={(e) => setUser(prevUser => ({ ...prevUser, bio: e.target.value }))}
                                placeholder="Write a short bio..."
                                rows="3"
                                disabled={!isEditing}
                            />
                        </div>
                        {!isEditing ? (
                            <button
                                type="button"
                                className="form-button"

                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditing(true)
                                }}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button type="submit" className="form-button">Save</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
