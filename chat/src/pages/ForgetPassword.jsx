import React, { useState } from 'react'
import './ForgetPassword.css'
import Ankit from '../assets/Ankit.png'
import { toast } from 'react-toastify';

const ForgetPassword = () => {

    const [email, setEmail] = useState("");

    const handleEmailChanges = (e) => {
        setEmail(e.target.value.trim());
        console.log("Searching for email:", email);


    }
    const sumbit = async (e) => {
        e.preventDefault();
        try {
            console.log("Email:", email);
           const response = await fetch("http://localhost:5000/Forget_password", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email: email }),
            });
            const json = await response.json();
              
            if (json.message === "Message sent in gmail" && json.user) {
                toast.success("message sent in gmail succesfull");
                setEmail("")
            } else {
                toast.error(json.message || "Invalid email .");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred. Please try again.");
        }
    }
 
    return (
        <div className='mainbox'>
            <div className='logo'>
                <img src={Ankit} alt="" />
            </div>
            <div className='forget'>
                <div className='heading-forget'>
                    <h1>Forget Your Password?</h1>
                    <p>We'll email you instructions on how to reset your password</p>
                </div>
                <div>
                    <input className='forget-input' type="text" placeholder='Enter your email' value={email} onChange={handleEmailChanges} />

                    <button className='forget-button' onClick={sumbit}>Reset Password</button>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword