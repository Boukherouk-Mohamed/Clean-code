
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { AddUser } from './AddUser';
import { EditUser } from './EditUser';
import styles from './styles.css';
import axios from 'axios';
import moment from 'moment';
import * as _ from 'lodash';

window.appState = {
  currentUser: null,
  userList: [],
  lastAction: null
};

const ROUTES = {
  HOME: '/',
  ADD_USER: '/add',
  EDIT_USER: '/edit/:id',
  USER_DETAILS: '/user/:id',
  API_BASE: 'http://localhost:8080/api/v1/users'
};

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    fetchUsers();
    document.title = 'User Management App';
  }, []);

  useEffect(() => {
    localStorage.setItem('lastVisit', new Date().toISOString());
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(ROUTES.API_BASE + '/all');
      const data = await response.json();
      setUsers(data);
      window.appState.userList = data;
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelection = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    window.appState.currentUser = user;
    window.location.href = `/user/${userId}`;
  };

  return (
    <BrowserRouter>
      <div style={{ padding: '20px', backgroundColor: theme === 'dark' ? '#333' : '#fff' }}>
        <header style={{ marginBottom: '20px' }}>
          <h1>User Management System</h1>
          <nav>
            <Link to="/" style={{marginRight: '10px', color: 'blue'}}>Home</Link>
            <Link to="/add" style={{marginRight: '10px', color: 'green'}}>Add User</Link>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              Toggle Theme
            </button>
          </nav>
        </header>

        {error && <div style={{color: 'red', margin: '10px 0'}}>{error}</div>}
        {loading && <div>Loading...</div>}

        <Routes>
          <Route 
            path="/" 
            element={
              <div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: '10px' }}
                />
                <select
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                  style={{ marginLeft: '10px' }}
                >
                  <option value="">All Ages</option>
                  <option value="18">Under 18</option>
                  <option value="60">Under 60</option>
                </select>

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
                    {users
                      .filter(user => 
                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                        (!filterAge || user.age < parseInt(filterAge))
                      )
                      .sort((a, b) => 
                        sortDirection === 'asc' ? a.age - b.age : b.age - a.age
                      )
                      .map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.age}</td>
                          <td>
                            <button onClick={() => handleUserSelection(user.id)}>
                              View
                            </button>
                            <Link to={`/edit/${user.id}`}>Edit</Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            } 
          />

          <Route path="/add" element={<AddUser setUsers={setUsers} users={users} />} />
          
          <Route 
            path="/edit/:id" 
            element={
              <EditUser 
                setUsers={setUsers} 
                users={users}
                onCancel={() => window.history.back()}
              />
            } 
          />

          <Route 
            path="/user/:id" 
            element={
              <UserDetails 
                users={users} 
                setSelectedUser={setSelectedUser}
              />
            } 
          />

        </Routes>

        <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}>
          <p>User Count: {users.length}</p>
          <p>Last Visit: {localStorage.getItem('lastVisit')}</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function UserDetails({ users, setSelectedUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const user = users.find(u => u.id === parseInt(id));
    if (user) {
      setSelectedUser(user);
    } else {
      navigate('/');
    }
  }, [id]); 

  return (
    <div>
      <h2>User Details</h2>
      <pre>{JSON.stringify(users.find(u => u.id === parseInt(id)), null, 2)}</pre>
    </div>
  );
}

export default App;

const globalStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  },
  input: {
    padding: '8px',
    marginBottom: '10px',
    width: '100%'
  }
};

window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', {message, source, lineno, colno, error});
  alert('An error occurred!');
};