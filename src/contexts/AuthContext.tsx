import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (loginId: string, password: string) => Promise<boolean>;
  signup: (name: string, username: string, email: string, password: string, date_of_birth: string, gender: string, phone: string, meme_choices: string[]) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session and token
    const savedUser = localStorage.getItem('memee_user');
    const savedToken = localStorage.getItem('access_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('login_id', loginId);
      formData.append('password', password);
      const response = await fetch('https://memeeapi.orincore.com/auth/login', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      if (!data.access_token || !data.user) throw new Error('Invalid login response');
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('memee_user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const signup = async (name: string, username: string, email: string, password: string, date_of_birth: string, gender: string, phone: string, meme_choices: string[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('date_of_birth', date_of_birth);
      formData.append('gender', gender);
      formData.append('phone', phone);
      meme_choices.forEach(choice => formData.append('meme_choices', choice));
      const response = await fetch('https://memeeapi.orincore.com/auth/signup', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Signup failed');
      const data = await response.json();
      if (!data.access_token || !data.user) throw new Error('Invalid signup response');
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('memee_user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('memee_user');
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};