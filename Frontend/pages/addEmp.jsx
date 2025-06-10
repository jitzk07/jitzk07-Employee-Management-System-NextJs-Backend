import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createEmployee, getAllEmployees } from "../services/employee";
import { getAllDepartments } from "../services/department";
import { getToken } from "../utils/auth";
import { toast } from "react-toastify";
import AddDepartmentModal from "../components/AddDepartmentModal";

export default function AddEmployeePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
  });
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!getToken()) return router.push("/login");

    const fetchDepartments = async () => {
      try {
        const res = await getAllDepartments();
        setDepartments(res.data);
      } catch (err) {
        toast.error("❌ Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(form);
      toast.success("Employee created successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "❌ Failed to create employee"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-12">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-slate-700">
          Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder:text-gray-500"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder:text-gray-500"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => {
                const input = e.target.value;

                if (!/^\d*$/.test(input)) {
                  alert("❌ Only numeric digits are allowed");
                  return;
                }

                if (input.length > 10) {
                  alert("❌ Phone number cannot exceed 10 digits");
                  return;
                }

                setForm((prev) => ({ ...prev, phone: input }));
              }}
              required
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder:text-gray-500"
            />

            <input
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder:text-gray-500"
            />
          </div>

          {/* Department Select and Add New */}
          <div className="flex items-center gap-4">
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-sm text-blue-600 hover:underline hover:text-blue-800"
            >
              + Add
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
            disabled={!form.name || !form.email || !form.department}
          >
            Create Employee
          </button>
        </form>
      </div>

      {/* Department Modal */}
      <AddDepartmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(newDept) => {
          setDepartments((prev) => [...prev, newDept]);
          setForm((prev) => ({ ...prev, department: newDept._id }));
        }}
      />
    </div>
  );
}
