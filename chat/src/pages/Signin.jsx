import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './form.css';
import Ankit from '../assets/Ankit.png';
import { toast } from 'react-toastify';
function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {

      const maskedPassword = '**'.repeat(formData.password.length);
      console.log("Email:", formData.email);
      console.log("Password:", maskedPassword);
      const response = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await response.json();

      if (json.message === "signin successful" && json.user) {
        localStorage.setItem('userId', json.user.id);
        toast.success("Login successful!");
        navigate('/home');
      } else {
        toast.error(json.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.");
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
          <img src={Ankit} alt=" Logo" className="logo" />
          <h1 className="logo-text">Ardent Chat</h1>
        </div> */}
        <div className="right-column">
          <div className="form-container1">
            <h2>Sign In</h2>
            <form >
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <NavLink to='/Forget' className="forget_password" >Forget Password </NavLink>
              </div>
              <button onClick={handleSubmitLogin} type="submit" className="form-button">Sign In</button>
            </form>
            <div className="form-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;