// src/api.js
import axios from 'axios';

// Configura la base URL para todas las solicitudes
const api = axios.create({
  baseURL: '/api',  // Aquí el proxy de Vite redirigirá correctamente
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
