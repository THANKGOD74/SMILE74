import { api } from './api';

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const updateProfile = async (data: { name?: string; currentPassword?: string; newPassword?: string }) => {
  const res = await api.put('/auth/profile', data);
  return res.data;
};

// 👇 NEW: Forgot password
export const forgotPassword = async (email: string) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

// 👇 NEW: Reset password
export const resetPassword = async (token: string, password: string) => {
  const res = await api.post(`/auth/reset-password/${token}`, { password });
  return res.data;
};

// ... existing functions

export const verifyEmail = async (token: string) => {
  const res = await api.get(`/auth/verify-email/${token}`);
  return res.data;
};



// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4040/api';

// export const register = async (name: string, email: string, password: string) => {
//   const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
//   return res.data; // { token, user }
// };

// export const login = async (email: string, password: string) => {
//   const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
//   return res.data;
// };