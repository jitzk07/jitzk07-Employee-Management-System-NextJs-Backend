// services/auth.js
import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logoutUser = async () => {
  await api.post('/auth/logout');
};

export const registerUser = async (fullName, email, password) => {
  const response = await api.post('/auth/register', { fullName, email, password, role: "admin" });
  return response.data;
};