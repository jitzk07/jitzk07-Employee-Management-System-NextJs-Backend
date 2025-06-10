// components/CreateAdminModal.jsx
import { useState } from "react";
import { registerUser } from "../services/auth";
import { toast } from "react-toastify";

export default function CreateAdminModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password) {
      return toast.error("All fields are required.");
    }

    try {
      const res = await registerUser(form.fullName, form.email, form.password, "admin");
      toast.success(`✅ Admin ${res.fullName} created`);
      onClose();
      setForm({ fullName: "", email: "", password: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Failed to create admin");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">+ Create Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F4A261] hover:bg-[#E76F51] text-white rounded-md"
            >
              Create Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
