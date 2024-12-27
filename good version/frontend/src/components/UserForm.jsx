// components/UserForm.jsx
import { useForm } from '../hooks/useForm';
import { Button } from './common/Button';
import { Input } from './common/Input';
import "../index.css"

const validationRules = {
  name: value => value.length < 2 ? 'Name too short' : null,
  age: value => isNaN(value) || value < 0 || value > 150 ? 'Invalid age' : null,
  email: value => !value.includes('@') ? 'Invalid email' : null
};

export const UserForm = ({ initialData, onSubmit, isEdit }) => {
  const { values, handleChange, errors, validate } = useForm(
    initialData || { name: '', age: '', email: '', phone: '', address: '' },
    validationRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        name="age"
        type="number"
        value={values.age}
        onChange={handleChange}
        error={errors.age}
      />
      <Input
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        name="phone"
        type="tel"
        value={values.phone}
        onChange={handleChange}
      />
      <Input
        name="address"
        value={values.address}
        onChange={handleChange}
      />
      <Button type="submit">
        {isEdit ? 'Update User' : 'Add User'}
      </Button>
    </form>
  );
};