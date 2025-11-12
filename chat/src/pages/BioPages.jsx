import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './form.css';
import Ankit from '../assets/Ankit.png';
import { toast } from 'react-toastify';

function BioPage() {
    const [bio, setBio] = useState('');
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleBioSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error("User not found. Please sign up again.");
            navigate('/signup');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/update-bio`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    bio: bio,
                }),
            });

            const json = await response.json();

            if (response.ok) {
                toast.success("Bio saved successfully!");
                localStorage.removeItem('userId');
                navigate('/signin');
            } else {
                toast.error(json.message || "Failed to save bio. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred. Please check your network connection.");
        }
    };


    return (
        <div>
            <div className='navbar1'>
                <div className='right-side1'>
                    <img src={Ankit} alt="logo" />
                    <h1>Ardent Chat</h1>
                </div>
                <div className='left-side1'>
                    <p onClick={() => navigate('/')}>Home</p>
                    <p onClick={() => navigate('/AboutUs')}>About Us</p>
                    <p onClick={() => navigate('/signup')}>SignUp</p>
                    <p onClick={() => navigate('/signin')}>SignIn</p>
                </div>
            </div>
            <div className="signup-page">
                {/* <div className="left-column">
                    <img src={Ankit} alt="Logo" className="logo" />
                    <h1 className="logo-text">Ardent Chat</h1>
                </div> */}
                <div className="right-column">
                    <div className="form-container">   
                        <h2>Provide a short bio</h2>
                        <form onSubmit={handleBioSubmit}>
                            <div className="form-group">
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us a little about yourself..."
                                    rows="5"
                                    required
                                />
                            </div>
                            <button type="submit" className="form-button">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BioPage;
