const env = process.env.REACT_APP_API_URL;

import axios from 'axios';

export const api = axios.create({
  baseURL: env,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Timeout: 5000,
    Expires: '0',
    WithCredentials: true,
  },
});

api.defaults.withCredentials = true;
