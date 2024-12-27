// components/AddUser.jsx
import { userService } from '../services/userService';
import { UserForm } from './UserForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AddUser = () => {
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try {
      await userService.create(userData);
      toast.success('User created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Add New User</h2>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
};
