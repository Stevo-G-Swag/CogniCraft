import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthContext initialized. User token:', token);
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser({ token: response.data.token });
      console.log('Login successful. Navigating to dashboard.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response.data.error);
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
      console.log('Registration successful. Navigating to login page.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response.data.error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    console.log('User logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);