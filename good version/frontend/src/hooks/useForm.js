// hooks/useForm.js
import { useState } from 'react';

export const useForm = (initialState = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(key => {
      const value = values[key];
      const rule = validationRules[key];
      const error = rule(value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, handleChange, errors, validate, setValues };
};