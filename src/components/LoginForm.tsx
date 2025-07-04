import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const LoginForm: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const data = new FormData();
    data.append('login_id', form.email);
    data.append('password', form.password);
    try {
      const res = await axios.post('/auth/login', data, {
        baseURL: API_BASE_URL,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Save token/user if needed
      localStorage.setItem('memee_user', JSON.stringify(res.data.user));
      localStorage.setItem('access_token', res.data.access_token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setMessage(
        err.response?.data?.detail || 'Login failed. Please try again.'
      );
      // If unverified, redirect to OTP
      if (err.response?.data?.detail?.toLowerCase().includes('verify')) {
        setTimeout(() => navigate('/verify-otp', { state: { email: form.email } }), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">Login</h2>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Logging In...' : 'Login'}
        </button>
        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">{message}</div>
      </form>
    </div>
  );
};

export default LoginForm; 