import axios from 'axios';

// Create an Axios instance
// This will use VITE_API_BASE_URL if set (like in production), 
// otherwise it falls back to the default relative paths (which Vite proxies locally)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

export default api;
