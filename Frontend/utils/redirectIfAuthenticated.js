// utils/redirectIfAuthenticated.js
import { getToken } from "./auth";

export const redirectIfAuthenticated = (router) => {
  const token = getToken();
  const role = localStorage.getItem("userRole");

  if (token) {
    if (role === "admin" || role === "employee") router.replace("/dashboard");
  }
};
