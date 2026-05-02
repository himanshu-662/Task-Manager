import axios from "axios";

const isProd = process.env.NODE_ENV === "production";
const baseURL = isProd ? "/api" : "http://localhost:5001/api";

const API = axios.create({
  baseURL
});

// Automatically add the token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;