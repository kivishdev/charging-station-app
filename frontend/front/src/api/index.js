import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VUE_API_BASE_URL || 'https://charging-station-app-kle6.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;