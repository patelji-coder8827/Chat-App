import React from 'react'
import './Dashboard.css'
import Ankit from '../assets/Ankit.png'
import { useNavigate } from 'react-router-dom'
 

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="dashboard">
            <div className='dashboard-container'>
                <div className='navbar'>
                    <div className='right-side'>
                        <img src={Ankit} alt="logo" />
                        <h1>Ardent Chat</h1>
                    </div>
                    <div className='left-side'>
                        <p onClick={()=>navigate('/')}>Home</p>
                        <p onClick={()=>navigate('/AboutUs')}>About Us</p>
                        <p onClick={()=>navigate('/signup')}>SignUp</p>
                        <p onClick={()=>navigate('/signin')}>SignIn</p>
                    </div>
                </div>
                <div className='main-content'>
                    <div className='left-column'>
                        <h2>Bringing Hearts Closer, One Message at a Time</h2>
                        <p>
                            Enter a space where chats glow with life. Effortless messaging, joyful interactions, and meaningful bonds converge in real-time. Stay close to your friends and family, making every moment vibrant, lively, and full of heartfelt connections. 🌌💖
                        </p>
                        <button className="cta-button" onClick={()=>navigate('/signup')}>Get Started</button>
                    </div>
                    <div className='right-column'>
                        <img src='cartoon .png' alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
