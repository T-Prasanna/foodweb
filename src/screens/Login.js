import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Login.css';
import api from "../api";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success) {
        localStorage.setItem('userEmail', credentials.email)
        localStorage.setItem('token', response.data.authToken)
        navigate("/");
      } else {
        alert("Enter Valid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong while logging in!");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div style={{backgroundImage: 'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg")', height: '100vh', backgroundSize: 'cover' }}>
      <Navbar />
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          <div className="m-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" name='email' value={credentials.email} onChange={onChange} />
          </div>
          <div className="m-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name='password' />
          </div>
          <button type="submit" className="m-3 btn btn-success">Submit</button>
          <Link to="/signup" className="m-3 mx-1 btn btn-danger">New User</Link>
        </form>
      </div>
    </div>
  )
}
