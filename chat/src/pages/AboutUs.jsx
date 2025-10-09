import React from 'react';
import './AboutUs.css';
import heroImg from '../assets/heroImg.png';
import connectImg from '../assets/g1.png';
import teamImg from '../assets/g2.png';
import { useNavigate } from 'react-router-dom';
import Ankit from '../assets/Ankit.png';

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="about-container">
      <div className='navbar'>
        <div className='right-side'>
          <img src={Ankit} alt="logo" />
          <h1>Ardent Chat</h1>
        </div>
        <div className='left-side'>
          <p onClick={() => navigate('/')}>Home</p>
          <p onClick={() => navigate('/AboutUs')}>About Us</p>
          <p onClick={() => navigate('/signup')}>SignUp</p>
          <p onClick={() => navigate('/signin')}>SignIn</p>
        </div>
      </div>

      <h1>About Us</h1>

      <div className="about-hero">
        <div className="hero-image">
          <img src={heroImg} alt="RealtimeChat Interface" />
        </div>
        <div className="hero-text">
          <h1>Ardent Chat</h1>
          <p>
            Ardent Chat is a personal passion project by Ankit Patel — a sleek, fast, and secure 
            messaging platform crafted with love and dedication for real-time conversations worldwide.
          </p>
        </div>
      </div>

      <section className="about-section">
        <h2>Who I Am</h2>
        <p>
          I’m Ankit Patel, a solo developer driven by curiosity, creativity, and problem-solving. 
          Ardent Chat is my vision of effortless, real-time communication — a platform I built 
          from scratch to help people connect seamlessly with friends and communities.
        </p>
      </section>

      <section className="about-section about-flex">
        <div className="about-image">
          <img src={connectImg} alt="Connecting People" />
        </div>
        <div className="about-text">
          <h2>My Vision</h2>
          <p>
            My goal is simple: make digital communication faster, smarter, and safer. 
            Whether you’re chatting one-on-one or connecting with a community, Ardent Chat 
            delivers a smooth, private, and enjoyable experience — crafted by me, for everyone.
          </p>
        </div>
      </section>

      <section className="about-section about-flex reverse">
        <div className="about-image">
          <img src={teamImg} alt="Developer" />
        </div>
        <div className="about-text">
          <h2>About the Developer</h2>
          <p>
            This project is the culmination of my curiosity, creativity, and determination. 
            I single-handedly designed, coded, and deployed Ardent Chat, putting attention 
            into every detail to create a modern, fast, and reliable messaging platform.
          </p>
        </div>
      </section>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Ardent Chat — All Rights Reserved.</p>
        <div className="developer-credit">
          <img src={Ankit} alt="Developer" />
          <div className="developer-info">
            <p>Developed with passion by <strong>Ankit Patel</strong></p>
            <p>Email: <a href="mailto:patelankit15123@gmail.com">patelankit15123@gmail.com</a></p>
            <p>LinkedIn: 
              <a href="https://www.linkedin.com/in/ankit-patel-623457288/" target="_blank" rel="noopener noreferrer">
                https://www.linkedin.com/in/ankit-patel-623457288/
              </a>
            </p>
            <p>Solo Developer | Full-Stack Creator | Tech Enthusiast</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
