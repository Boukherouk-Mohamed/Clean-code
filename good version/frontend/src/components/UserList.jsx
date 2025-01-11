// components/UserList.jsx
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userService } from '../services/userService';
import { Link } from 'react-router-dom';
import { Button } from './common/Button';
import { useState } from 'react';
import './UserList.css';


export const UserList = () => {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery('users', () =>
    userService.getAll().then(res => res.data)
  );

  const deleteMutation = useMutation(
    (id) => userService.delete(id),
    {
      onSuccess: () => queryClient.invalidateQueries('users')
    }
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.age}</td>
                <td className="px-6 py-4 text-right space-x-2 button ">
                  <Link to={`/edit/${user.id}`}>
                    <Button className="secondary" >Edit</Button>
                  </Link>
                  <Button
                    className="danger"
                    onClick={() => {
                      if (window.confirm('Delete this user?')) {
                        deleteMutation.mutate(user.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
