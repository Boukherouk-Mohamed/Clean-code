
// UserContext.js
// Violation: Poorly implemented context
import React from 'react';

export const UserContext = React.createContext();

// Violation: Provider with no error boundary
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

// api.js
// Violation: No error handling, hardcoded URLs
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

// utils.js
// Violation: Poor utility function organization
export const utils = {
  formatDate: (date) => date.toLocaleDateString(),
  validateEmail: (email) => email.includes('@'),
  calculateAge: (birthDate) => {
    // Violation: Magic numbers
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  },
  // Violation: Inconsistent error handling
  parseUserData: (data) => {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
};