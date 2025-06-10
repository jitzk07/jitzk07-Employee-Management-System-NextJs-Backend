import api from './api';

export const createDepartment = async (name) => {
  return api.post('/departments/create', { name });
};

export const getAllDepartments = async () => {
  return api.get('/departments/getAll');
};

export const getDepartmentById = async (id) => {
  return api.get(`/departments/${id}`);
};

export const updateDepartment = async (id, updatedData) => {
  return api.put(`/departments/${id}`, updatedData);
};

export const deleteDepartment = async (id) => {
  return api.delete(`/departments/${id}`);
};
