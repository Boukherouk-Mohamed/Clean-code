// components/EditUser.jsx
import { userService } from '../services/userService';
import { UserForm } from './UserForm';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (userData) => {
    try {
      await userService.update(id, userData);
      toast.success('User updated successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Edit User</h2>
      <UserForm onSubmit={handleSubmit} isEdit />
    </div>
  );
};
