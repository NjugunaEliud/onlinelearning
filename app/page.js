"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });

      if (response.status === 200) {
        const { accessToken, role , email , username , id} = response.data;

        // Store the token in local storage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('role', role);
        localStorage.setItem('Username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('id', id);
        console.log(role)

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have been logged in successfully.',
        });

        // Redirect based on user role
        if (role === 'student') {
          router.push('/students');
        } else if (role === 'approver') {
          router.push('/courses');
        } else if (role === 'instructor') {
          router.push('/courses');
        } else {
          router.push('/'); 
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Please check your email and password and try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-gray-600 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Login
          </button>
          <p className='mt-4'>Don't have an account? <span className='text-gray-800 font-semibold'><Link href="/createaccount">Register.</Link></span></p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
