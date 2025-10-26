import axios from 'axios';

const API_BASE_URL = 'http://your-backend-url/api'; // Replace with your API backend address

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
