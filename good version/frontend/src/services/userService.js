// services/userService.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1/users';

export const userService = {
  getAll: () => axios.get(API_BASE),
  getById: (id) => axios.get(`${API_BASE}/${id}`),
  create: (user) => axios.post(API_BASE, user),
  update: (id, user) => axios.put(`${API_BASE}/${id}`, user),
  delete: (id) => axios.delete(`${API_BASE}/${id}`)
};
