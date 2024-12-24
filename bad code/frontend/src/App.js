
import React, { useState, useEffect } from 'react';

window.globalUserCache = [];
let tempUserData = null;

const styles = {
  container: { padding: '20px' },
  btn: { backgroundColor: 'blue' }
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setAge(selectedUser.age);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:8080/api/v1/users/all');
    const data = await response.json();
    setUsers(data);
    window.globalUserCache = data;
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, age: parseInt(age) };
      if (editMode && selectedUser) {
        const response = await fetch(`http://localhost:8080/api/v1/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          alert('User updated!'); 
          fetchUsers();
        }
      } else {
        const response = await fetch('http://localhost:8080/api/v1/users/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        if (response.ok) {
          alert('User created!'); 
          fetchUsers();
        }
      }
    } catch (err) {
      console.log(err); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) { 
      try {
        await fetch(`http://localhost:8080/api/v1/users/${id}`, {
          method: 'DELETE',
        });
        alert('User deleted!');
        fetchUsers();
      } catch (err) {
        console.error(err); 
      }
    }
  };

  const formatAge = (age) => {
    if (!age) return null;
    if (age < 18) return 'Minor';
    if (age < 65) return age;
    return age + ' (Senior)';
  };

  return (
    <div style={styles.container}>
      
      <h1 style={{ color: 'blue', fontSize: '24px' }}>User Management</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          style={{ marginRight: '10px' }}
        />
        <button type="submit" style={styles.btn}>
          {editMode ? 'Update' : 'Create'} User
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{formatAge(user.age)}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setEditMode(true);
                  }}
                  style={{ marginRight: '5px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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