# 🧑‍💼 Admin & Employee Management System (Next.js + Node.js)

This is a role-based admin dashboard built with **Next.js** (frontend) and **Node.js/Express** (backend). It supports secure authentication, employee CRUD operations, and admin control features, all designed to be responsive and mobile-friendly.

---

## 🚀 Features

### ✅ Authentication
- Login via email & password
- JWT-based token storage with localStorage
- Role-based access: `admin`, `employee`

### ✅ Admin Functionalities
- Register other admins (only if logged in as admin)
- Create, edit, view, and delete employees
- Create and manage departments
- Protected route access with `authorizeRoles`

### ✅ UI/UX Highlights
- Mobile-responsive layout using Tailwind CSS
- Burger menu on mobile view for admin actions (`Create Employee`, `Create Department`, `Create Admin`, `Logout`)
- Table view for desktop and card-style list for mobile
- Dynamic color palette using professional pastel tones

---

## 📦 Tech Stack

| Layer      | Tech                         |
|------------|------------------------------|
| Frontend   | Next.js, Tailwind CSS, React Icons, Toastify |
| Backend    | Node.js, Express.js          |
| Database   | MongoDB + Mongoose           |
| Auth       | JWT-based auth with middleware protection |
| API Client | Axios with centralized wrapper |

---

## 🛠️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/jitzk07/jitzk07-Employee-Management-System-NextJs-Backend
cd backend/npm run dev
cd frontend/npm run dev