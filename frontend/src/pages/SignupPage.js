import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: Yup.string().oneOf(['admin', 'accountant'], 'Role must be admin or accountant').required('Role is required')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', data);
      alert('Signup successful! Please login.');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Signup failed!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Role (admin/accountant)</label>
            <input
              type="text"
              {...register('role')}
              className="w-full px-3 py-2 border rounded"
            />
            <p className="text-red-500 text-sm">{errors.role?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Signup
          </button>
        </form>

        {/* Login prompt */}
        <div className="text-center mt-4">
          <p>
            Already have an account?
            <a href="/" className="text-blue-500 hover:underline"> Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
