export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// utils/auth.js
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole"); 
};

