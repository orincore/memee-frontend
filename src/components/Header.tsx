import React from 'react';
import { Search, Filter, Moon, Sun, Sparkles, User, LogOut, Plus, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Category, AuthMode } from '../types';
import { Link } from 'react-router-dom';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  setAuthMode: (mode: AuthMode) => void;
  onPostClick?: () => void;
  onMyMemesClick?: () => void;
}

const categories: Category[] = ['All', 'Dark Humor', 'Dank Memes', 'Wholesome', 'Comedy', 'Gaming', 'Trending'];

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  showFilters,
  setShowFilters,
  setAuthMode,
  onPostClick,
  onMyMemesClick
}) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 dark:from-gray-900 dark:via-purple-900 dark:to-yellow-900 backdrop-blur-md border-b-4 border-yellow-300 dark:border-purple-700 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500 rounded-2xl shadow-lg border-2 border-white dark:border-purple-700">
              <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 bg-clip-text text-transparent tracking-tight">
                Memee
              </h1>
              <p className="text-xs text-gray-700 dark:text-yellow-200 -mt-1 font-mono">Your daily dose of memes</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for memes, trends, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                showFilters 
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Filter</span>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onPostClick}
                  className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-md hover:from-yellow-400 hover:to-pink-500 transition-colors text-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline text-base font-bold">Post</span>
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <img
                      src={user.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.username}
                    </span>
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    {onMyMemesClick && (
                      <button
                        onClick={onMyMemesClick}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">My Memes</span>
                      </button>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2 text-base font-bold text-purple-700 bg-white/80 rounded-xl shadow-md border-2 border-purple-300 hover:bg-purple-100 hover:text-pink-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 text-base font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow-md border-2 border-pink-300 hover:from-yellow-400 hover:to-pink-500 hover:text-purple-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};