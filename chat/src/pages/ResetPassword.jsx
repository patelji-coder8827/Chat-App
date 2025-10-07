import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ResetPassword.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            toast.error("Invalid or missing token.");
            navigate('/login');
        }
    }, [location, navigate]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters long.");
        }

        try {
            const response = await fetch("http://localhost:5000/reset_password", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });
            const json = await response.json();

            if (response.ok) {
                toast.success(json.message);
                navigate('/signin');
            } else {
                toast.error(json.message || "An error occurred during password reset.");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className='reset-password-mainbox'>
            <div className='reset-password-container'>
                <h1>Reset Your Password</h1>
                <form onSubmit={handlePasswordReset}>
                    <input
                        className='reset-password-input'
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        className='reset-password-input'
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className='reset-password-button' type="submit">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;