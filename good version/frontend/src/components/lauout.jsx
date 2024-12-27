// components/Layout.jsx
import { Link } from 'react-router-dom';

export const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">User Management</Link>
        <Link to="/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add User
        </Link>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
  </div>
);
