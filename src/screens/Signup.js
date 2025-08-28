import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import '../styles/Signup.css';
import api from "../api";

export default function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" })
  let [address, setAddress] = useState("");
  let navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault();
    let navLocation = () => {
      return new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      });
    }
    let [lat, long] = await navLocation().then(res => [res.coords.latitude, res.coords.longitude]);

    try {
      const response = await api.post("/api/auth/getlocation", { latlong: { lat, long } });
      setAddress(response.data.location);
      setCredentials({ ...credentials, geolocation: response.data.location });
    } catch (error) {
      console.error("Location Error:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/createuser", {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.authToken);
        navigate("/login");
      } else {
        alert("Enter Valid Credentials");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong while signing up!");
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg")', backgroundSize: 'cover', height: '100vh' }}>
      <Navbar />
      <div className='container'>
        <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
          {/* form fields same as before */}
        </form>
      </div>
    </div>
  )
}
