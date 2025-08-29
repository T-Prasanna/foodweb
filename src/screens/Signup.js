import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Signup.css';
import api from "../api";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: ""
  });
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  // ✅ Get Location
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let navLocation = () => {
        return new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
      };

      let [lat, long] = await navLocation().then(res => [res.coords.latitude, res.coords.longitude]);

      const response = await api.post("/api/auth/getlocation", {
        latlong: { lat, long }
      });

      setAddress(response.data.location);
      setCredentials({ ...credentials, geolocation: response.data.location });
    } catch (error) {
      console.error("Location Error:", error);
      alert("Could not fetch location. Please enter your address manually.");
    }
  };

  // ✅ Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/createuser", {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.geolocation || address
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.authToken);
        navigate("/login");
      } else {
        alert("Enter Valid Credentials");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong while signing up!");
    }
  };

  // ✅ Input Change
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg")',
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <Navbar />
      <div className="container">
        <form
          className="w-50 m-auto mt-5 border bg-dark border-success rounded p-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-center text-light">Signup</h2>

          <div className="mb-3">
            <label htmlFor="name" className="form-label text-light">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={credentials.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="geolocation" className="form-label text-light">Location</label>
            <input
              type="text"
              className="form-control"
              name="geolocation"
              value={credentials.geolocation || address}
              onChange={onChange}
              placeholder="Click 'Get Location' or enter manually"
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleClick}
            >
              Get Location
            </button>

            <button type="submit" className="btn btn-primary">
              Signup
            </button>
          </div>

          <p className="text-center text-light mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
