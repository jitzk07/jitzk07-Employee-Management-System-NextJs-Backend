import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getEmployeeById, updateEmployee } from "../../services/employee";
import { getAllDepartments } from "../../services/department";
import { toast } from "react-toastify";

export default function EditEmployeePage() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const empRes = await getEmployeeById(id);
        const emp = empRes.data;

        setFormData({
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          department: emp.department?._id || "",
          designation: emp.designation || "",
        });
      } catch {
        toast.error("❌ Failed to fetch employee");
        router.push("/dashboard");
      }

      try {
        const depRes = await getAllDepartments();
        setDepartments(depRes.data);
      } catch {
        toast.error("❌ Failed to load departments");
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateEmployee(id, formData);
      toast.success("✅ Employee updated successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          ✏️ Edit Employee
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder:text-gray-500 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder:text-gray-500 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder:text-gray-500 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg text-black bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">🎯 Select Department</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder:text-gray-500 bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="text-gray-600 hover:underline"
            >
              ← Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#77DD77] hover:bg-[#66CC66] text-white px-5 py-2 rounded-md transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
