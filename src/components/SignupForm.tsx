import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles } from 'lucide-react';

const API_BASE_URL = 'https://memeeapi.orincore.com';

const memeBg = 'bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 dark:from-gray-900 dark:via-purple-900 dark:to-yellow-900';

const MEME_CATEGORIES = [
  'dark',
  'dank',
  'funny',
  'comedy',
  'wholesome',
  'gaming',
  'trending',
  'animals',
  'relatable',
  'classic',
  'random',
];

const SignupForm: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    date_of_birth: '',
    gender: '',
    meme_choices: '',
    profile_pic: null as File | null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCategoryToggle = (cat: string) => {
    let newSelected = [...selectedCategories];
    if (newSelected.includes(cat)) {
      newSelected = newSelected.filter(c => c !== cat);
    } else if (newSelected.length < 5) {
      newSelected.push(cat);
    }
    setSelectedCategories(newSelected);
    setForm(prev => ({ ...prev, meme_choices: newSelected.join(',') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // Validate required fields
    const requiredFields = ['name', 'username', 'email', 'phone', 'password', 'date_of_birth', 'meme_choices'];
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form] || (field === 'meme_choices' && String(form.meme_choices).trim() === '')) {
        setMessage(`Please fill in all required fields.`);
        setLoading(false);
        return;
      }
    }
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'profile_pic') {
        if (value) data.append('profile_pic', value as File);
      } else if (key === 'meme_choices') {
        // Always send as string, trimmed
        data.append('meme_choices', String(value).trim());
      } else if (value) {
        data.append(key, value as any);
      }
    });
    try {
      await axios.post('/auth/signup', data, {
        baseURL: API_BASE_URL,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Signup successful! Please check your email for OTP.');
      setTimeout(() => navigate('/verify-otp', { state: { email: form.email } }), 1200);
    } catch (err: any) {
      setMessage(
        err.response?.data?.detail || 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${memeBg} p-4`}>
      <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-8 relative border-4 border-yellow-300 dark:border-purple-700">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg mb-2">
            <Sparkles className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-extrabold text-purple-700 dark:text-yellow-200 text-center mb-1 tracking-tight">
            Join Memee by Orincore
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 text-base font-mono">
            Where Memes Rule the Internet 😎
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div className="flex gap-2">
            <input name="name" placeholder="Name" onChange={handleChange} required className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold" />
            <input name="username" placeholder="Username" onChange={handleChange} required className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold" />
          </div>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold" />
          <input name="phone" placeholder="Phone" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold" />
          <input name="date_of_birth" type="date" onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold" />
          <div className="flex gap-2">
            <input name="gender" placeholder="Gender (optional)" onChange={handleChange} className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold" />
            <div className="w-1/2 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Favorite Meme Categories (up to 5)</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(v => !v)}
                  className={`w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold h-12 flex items-center justify-between ${dropdownOpen ? 'ring-2 ring-purple-400' : ''}`}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                >
                  <span className="truncate text-left">
                    {selectedCategories.length > 0
                      ? selectedCategories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(', ')
                      : 'Select categories...'}
                  </span>
                  <span className="ml-2 text-purple-500">▼</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto animate-fade-in">
                    {MEME_CATEGORIES.map(cat => (
                      <div
                        key={cat}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors rounded-xl ${selectedCategories.includes(cat) ? 'bg-purple-200 dark:bg-purple-800/40 font-bold' : ''}`}
                        onClick={() => handleCategoryToggle(cat)}
                        tabIndex={0}
                        role="option"
                        aria-selected={selectedCategories.includes(cat)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCategoryToggle(cat); }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          readOnly
                          className="mr-2 accent-purple-500 w-4 h-4 rounded"
                        />
                        <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedCategories.map(cat => (
                  <span key={cat} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    {cat}
                    <button
                      type="button"
                      className="ml-1 text-purple-700 hover:text-pink-500 focus:outline-none"
                      onClick={() => handleCategoryToggle(cat)}
                      aria-label={`Remove ${cat}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Pic (optional)</label>
            <input name="profile_pic" type="file" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white py-3 rounded-xl font-extrabold text-lg shadow-lg hover:from-yellow-500 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? 'Signing Up...' : 'Sign Up & Meme On!'}
          </button>
          <div className="text-center text-sm text-gray-700 dark:text-gray-200 mt-2">
            {message}
          </div>
        </form>
        <div className="text-center mt-6">
          <span className="text-gray-600 dark:text-gray-300">Already have an account? </span>
          <Link to="/login" className="text-purple-600 hover:text-pink-500 font-bold underline">Login</Link>
        </div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl select-none pointer-events-none">
          <span role="img" aria-label="meme">😂</span>
        </div>
      </div>
    </div>
  );
};

export default SignupForm; 