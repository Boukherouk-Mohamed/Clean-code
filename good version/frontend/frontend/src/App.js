// App.jsx
// Violation: Mixing routing logic with component logic and poor import organization
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { AddUser } from './AddUser';
import { EditUser } from './EditUser';
import styles from './styles.css';
import axios from 'axios';
import moment from 'moment';
import * as _ from 'lodash';

// Violation: Global state management
window.appState = {
  currentUser: null,
  userList: [],
  lastAction: null
};

// Violation: Mixing component logic with route definitions
const ROUTES = {
  HOME: '/',
  ADD_USER: '/add',
  EDIT_USER: '/edit/:id',
  USER_DETAILS: '/user/:id',
  // Violation: Hardcoded API URLs
  API_BASE: 'http://localhost:8080/api/v1/users'
};

// Violation: Poorly structured main component
function App() {
  // Violation: Too many state declarations
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState('light');

  // Violation: Multiple useEffects with similar concerns
  useEffect(() => {
    fetchUsers();
    // Violation: Side effect in useEffect
    document.title = 'User Management App';
  }, []);

  useEffect(() => {
    // Violation: Local storage in component
    localStorage.setItem('lastVisit', new Date().toISOString());
  }, []);

  // Violation: Complex data fetching logic in component
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(ROUTES.API_BASE + '/all');
      const data = await response.json();
      setUsers(data);
      // Violation: Global state mutation
      window.appState.userList = data;
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Violation: Navigation logic mixed with business logic
  const handleUserSelection = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    window.appState.currentUser = user;
    // Violation: Direct navigation manipulation
    window.location.href = `/user/${userId}`;
  };

  // Violation: Complex JSX with poor organization
  return (
    <BrowserRouter>
      {/* Violation: Inline styles */}
      <div style={{ padding: '20px', backgroundColor: theme === 'dark' ? '#333' : '#fff' }}>
        {/* Violation: Navigation mixed with header */}
        <header style={{ marginBottom: '20px' }}>
          <h1>User Management System</h1>
          <nav>
            {/* Violation: Inconsistent styling */}
            <Link to="/" style={{marginRight: '10px', color: 'blue'}}>Home</Link>
            <Link to="/add" style={{marginRight: '10px', color: 'green'}}>Add User</Link>
            {/* Violation: Theme toggle in header */}
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              Toggle Theme
            </button>
          </nav>
        </header>

        {/* Violation: Error handling mixed with routes */}
        {error && <div style={{color: 'red', margin: '10px 0'}}>{error}</div>}
        {loading && <div>Loading...</div>}

        {/* Violation: Poor route organization */}
        <Routes>
          <Route 
            path="/" 
            element={
              // Violation: Complex filtering logic in route
              <div>
                {/* Violation: Search/filter logic in main component */}
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

                {/* Violation: Complex table structure in route */}
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
                            {/* Violation: Inline event handlers */}
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

          {/* Violation: No loading states for lazy-loaded routes */}
          <Route path="/add" element={<AddUser setUsers={setUsers} users={users} />} />
          
          {/* Violation: Prop drilling through routes */}
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

          {/* Violation: Incomplete route implementation */}
          <Route 
            path="/user/:id" 
            element={
              <UserDetails 
                users={users} 
                setSelectedUser={setSelectedUser}
              />
            } 
          />

          {/* Violation: No 404 handling */}
        </Routes>

        {/* Violation: Footer mixed with routes */}
        <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc' }}>
          <p>User Count: {users.length}</p>
          {/* Violation: Direct localStorage access in render */}
          <p>Last Visit: {localStorage.getItem('lastVisit')}</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

// Violation: Poorly implemented user details component
function UserDetails({ users, setSelectedUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Violation: Effect with missing dependency
  useEffect(() => {
    const user = users.find(u => u.id === parseInt(id));
    if (user) {
      setSelectedUser(user);
    } else {
      // Violation: Direct navigation
      navigate('/');
    }
  }, [id]); // Missing dependencies: users, setSelectedUser, navigate

  // Violation: No loading or error states
  return (
    <div>
      <h2>User Details</h2>
      {/* Violation: Unsafe direct array access */}
      <pre>{JSON.stringify(users.find(u => u.id === parseInt(id)), null, 2)}</pre>
    </div>
  );
}

export default App;

// Violation: Global styles with no organization
const globalStyles = {
  // Violation: Magic numbers in styles
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

// Violation: Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', {message, source, lineno, colno, error});
  // Violation: Alert in error handler
  alert('An error occurred!');
};