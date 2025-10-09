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
                        <h2>Chatting Friends & Family</h2>
                        <p>Connect with your loved ones through seamless messaging.</p>
                        <span>This version focuses on the emotional benefit of connecting with "the people who matter most" 
                            and uses words like "vibrant" and "effortless" to create a more vivid and appealing image.</span>

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
