import axios from "axios";

const api = axios.create({
  baseURL: "https://food-backend-1-y86j.onrender.com",  // backend URL
});

export default api;
