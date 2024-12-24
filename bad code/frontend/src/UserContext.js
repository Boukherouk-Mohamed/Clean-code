
import React from 'react';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    users: [],
    selectedUser: null,
  });

  const value = {
    state,
    setState,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


export const api = {
  baseUrl: 'http://localhost:8080',
  
  async getUsers() {
    const response = await fetch(this.baseUrl + '/api/v1/users/all');
    return response.json();
  },
  
  async createUser(data) {
    const response = await fetch(this.baseUrl + '/api/v1/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

export const utils = {
  formatDate: (date) => date.toLocaleDateString(),
  validateEmail: (email) => email.includes('@'),
  calculateAge: (birthDate) => {
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  },
  parseUserData: (data) => {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
};