// import axios from 'axios';
// import type { Task, TaskInput } from '../types';


// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4040/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: { 'Content-Type': 'application/json' },
// });

// export const fetchTasks = async (): Promise<Task[]> => {
//   const response = await api.get('/tasks');
//   return response.data;
// };

// export const createTask = async (task: TaskInput): Promise<Task> => {
//   const response = await api.post('/tasks', task);
//   return response.data;
// };

// export const updateTask = async (id: string, updates: Partial<TaskInput>): Promise<Task> => {
//   const response = await api.put(`/tasks/${id}`, updates);
//   return response.data;
// };

// export const deleteTask = async (id: string): Promise<void> => {
//   await api.delete(`/tasks/${id}`);
// };




// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({ baseURL: API_BASE });

// // 👇 Interceptor to attach the token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   console.log(' Token from localStorage:', token); // will show in console
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log(' Token attached to request');
//   } else {
//     console.warn(' No token found');
//   }
//   return config;
// });

// // API functions
// export const fetchTasks = async () => {
//   const res = await api.get('/tasks');
//   return res.data;
// };

// export const createTask = async (task: any) => {
//   const res = await api.post('/tasks', task);
//   return res.data;
// };

// export const updateTask = async (id: string, updates: any) => {
//   const res = await api.put(`/tasks/${id}`, updates);
//   return res.data;
// };

// export const deleteTask = async (id: string) => {
//   const res = await api.delete(`/tasks/${id}`);
//   return res.data;
// };




import axios from 'axios';
import type { Task, TaskInput } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4040/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (task: TaskInput): Promise<Task> => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id: string, updates: Partial<TaskInput>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// ... existing login, register functions ...
export const updateProfile = async (data: { name?: string; currentPassword?: string; newPassword?: string }) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${API_BASE}/auth/profile`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};