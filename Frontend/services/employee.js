import api from './api';

export const createEmployee = async (employeeData) => {
  return api.post('/employees/create', employeeData);
};

export const getAllEmployees = async (filters = {}) => {
  return api.get('/employees/getAll', { params: filters });
};

export const getEmployeeById = async (id) => {
  return api.get(`/employees/${id}`);
};

export const updateEmployee = async (id, updatedData) => {
  return api.put(`/employees/${id}`, updatedData);
};

export const deleteEmployee = async (id) => {
  return api.delete(`/employees/${id}`);
};

export const getEmployeesByDepartment = async (departmentId) => {
  return api.get(`/employees/department/${departmentId}`);
};
