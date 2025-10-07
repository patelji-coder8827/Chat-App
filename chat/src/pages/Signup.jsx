import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './form.css';
import Ankit from '../assets/ankit.png';
import { toast } from 'react-toastify';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FullName: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSumbit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match. Please try again.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const json = await response.json();

            if (response.ok && json.message === "signup successful") {
                if (json.userId) {
                    localStorage.setItem('userId', json.userId);
                }
                toast.success("Signup successful! Please provide your bio.");
                navigate('/bio');
            } else {
                toast.error(json.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred. Please check your network connection.");
        }
    };

    return (
        <div className="signup-page">
            <div className="left-column">
                <img src={Ankit} alt="logo" className="logo" />
                <h1 className="logo-text">Ardent Chat</h1>
            </div>
            <div className="right-column">
                <div className="form-container">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSumbit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder='Name'
                                value={formData.FullName}
                                name='FullName'
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder='Email'
                                value={formData.email}
                                name='email'
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder='Password'
                                value={formData.password}
                                name='password'
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder='Confirm Password'
                                value={formData.confirm_password}
                                name='confirm_password'
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="form-button">Create Account</button>
                    </form>
                    <div className="form-link">
                        Already have an account? <Link to="/signin">Login here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
