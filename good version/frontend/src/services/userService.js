import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1/users';

const handleRequest = async (requestFunction) => {
  try {
    const response = await requestFunction();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API Error:', error.message);
    return {
      data: null,
      error: error.response?.data?.message || 'Something went wrong. Please try again.',
    };
  }
};

export const userService = {
  getAll: async () => {
    return await handleRequest(() => axios.get(API_BASE));
  },
  getById: async (id) => {
    return await handleRequest(() => axios.get(`${API_BASE}/${id}`));
  },
  create: async (user) => {
    return await handleRequest(() => axios.post(API_BASE, user));
  },
  update: async (id, user) => {
    return await handleRequest(() => axios.put(`${API_BASE}/${id}`, user));
  },
  delete: async (id) => {
    return await handleRequest(() => axios.delete(`${API_BASE}/${id}`));
  },
};
