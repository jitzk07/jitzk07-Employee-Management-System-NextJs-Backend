import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAllEmployees, deleteEmployee } from "../services/employee";
import { getAllDepartments } from "../services/department";
import { getToken, removeToken } from "../utils/auth";
import { logoutUser } from "../services/auth";
import { toast } from "react-toastify";
import { GrFormView } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import AddDepartmentModal from "../components/AddDepartmentModal";
import CreateAdminModal from "../components/CreateAdminModal";

export default function DashboardPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!getToken()) return router.push("/login");

    const userRole = localStorage.getItem("userRole");
    setRole(userRole);

    const fetchInitialData = async () => {
      try {
        const depRes = await getAllDepartments();
        setDepartments(depRes.data);
      } catch {
        toast.error("Failed to load departments");
      }

      await fetchEmployees(search, department, page);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (getToken()) fetchEmployees(search, department, page);
  }, [search, department, page]);

  const fetchEmployees = async (search, department, page) => {
    try {
      const res = await getAllEmployees({ search, department, page, limit });
      setEmployees(res.data.employees || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Error loading employees");
      setEmployees([]);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      removeToken();
      localStorage.removeItem("userRole");
      router.push("/login");
      toast.success("👋 Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await deleteEmployee(id);
      toast.success("🗑️ Employee deleted");
      await fetchEmployees(search, department, page);
    } catch {
      toast.error("❌ Failed to delete employee");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 sm:px-6 py-8">
      {/* 🔝 Header */}
      <div className="bg-[#CDEDF6] rounded-xl p-6 mb-8 shadow flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Dashboard
        </h1>

        {/* 🖥️ Desktop View */}
        <div className="hidden sm:flex flex-wrap gap-3 w-full sm:w-auto">
          {role === "admin" && (
            <>
              <button
                onClick={() => router.push("/addEmp")}
                className="bg-[#77DD77] hover:bg-[#66CC66] text-white px-4 py-2 rounded-md"
              >
                + Create Employee
              </button>
              <button
                onClick={() => setShowDepartmentModal(true)}
                className="bg-[#6FB1FC] hover:bg-[#589FF4] text-white px-4 py-2 rounded-md"
              >
                + Create Department
              </button>
              <button
                onClick={() => setShowAdminModal(true)}
                className="bg-[#F4A261] hover:bg-[#E76F51] text-white px-4 py-2 rounded-md"
              >
                + Create Admin
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-[#FF6961] hover:bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>


        {/* 🌐 Mobile View */}
        <div className="block sm:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-[#6FB1FC] hover:bg-[#589FF4] text-white px-4 py-2 rounded-md w-full"
          >
            ☰ Admin Menu
          </button>

          {menuOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/addEmp");
                }}
                className="block w-full text-left bg-[#77DD77] hover:bg-[#66CC66] text-white px-4 py-2 rounded-md"
              >
                + Create Employee
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowDepartmentModal(true);
                }}
                className="block w-full text-left bg-[#6FB1FC] hover:bg-[#589FF4] text-white px-4 py-2 rounded-md"
              >
                + Create Department
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowAdminModal(true);
                }}
                className="block w-full text-left bg-[#F4A261] hover:bg-[#E76F51] text-white px-4 py-2 rounded-md"
              >
                + Create Admin
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left bg-[#FF6961] hover:bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>


      </div>

      {/* 🔍 Search and Filter */}
      <div className="bg-gradient-to-r from-[#FFF5D1] via-[#E0F7FA] to-[#E1F5FE] p-6 rounded-2xl shadow-lg mb-10 flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg bg-white placeholder:text-gray-500 shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-800"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full md:w-64 border border-gray-300 p-3 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 text-gray-800"
        >
          <option value="">🎯 All Departments</option>
          {departments.map((dep) => (
            <option key={dep._id} value={dep._id}>
              {dep.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔍 Employee List */}
      {!employees || employees.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-lg">
          No employees found.
        </p>
      ) : (
        <>
          {/* 👨‍💼 Desktop Table (visible only on md+) */}
          <div className="hidden md:block w-full overflow-x-auto rounded-xl shadow">
            <table className="min-w-full bg-white text-sm text-left">
              <thead className="bg-[#E1F5FE] text-gray-900 font-semibold">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-t hover:bg-[#F0F4FF] transition-colors duration-200"
                  >
                    <td className="px-4 py-3">{emp.name}</td>
                    <td className="px-4 py-3">{emp.email}</td>
                    <td className="px-4 py-3">{emp.department?.name || "—"}</td>
                    <td className="px-4 py-3 flex justify-center gap-3 text-xl">
                      <button onClick={() => setSelectedEmployee(emp)} title="View">
                        <GrFormView className="text-[#6C63FF] hover:text-[#ABA7FF] transition" />
                      </button>
                      {role === "admin" && (
                        <>
                          <button onClick={() => router.push(`/edit/${emp._id}`)} title="Edit">
                            <FaUserEdit className="text-[#FFD166] hover:text-[#FFE29A] transition" />
                          </button>
                          <button onClick={() => handleDelete(emp._id)} title="Delete">
                            <MdDeleteForever className="text-[#EF476F] hover:text-[#FFB5C5] transition" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* 📱 Mobile Card View (visible only on <md) */}
          <div className="md:hidden space-y-4">
            {employees.map((emp) => (
              <div
                key={emp._id}
                className="bg-[#F9FAFB] rounded-xl shadow-md p-4 space-y-3 border border-[#E0E7FF]"
              >
                <p className="text-gray-800">
                  <strong>Name:</strong> {emp.name}
                </p>
                <p className="text-gray-800">
                  <strong>Email:</strong> {emp.email}
                </p>
                <p className="text-gray-800">
                  <strong>Department:</strong> {emp.department?.name || "—"}
                </p>

                <div className="flex gap-4 justify-start text-xl pt-2">
                  <button onClick={() => setSelectedEmployee(emp)} title="View">
                    <GrFormView className="text-[#6C63FF] hover:text-[#ABA7FF] transition" />
                  </button>

                  {role === "admin" && (
                    <>
                      <button onClick={() => router.push(`/edit/${emp._id}`)} title="Edit">
                        <FaUserEdit className="text-[#FFD166] hover:text-[#FFE29A] transition" />
                      </button>

                      <button onClick={() => handleDelete(emp._id)} title="Delete">
                        <MdDeleteForever className="text-[#EF476F] hover:text-[#FFB5C5] transition" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>



          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-black hover:bg-gray-500 disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="px-4 py-2 bg-black text-white">{`Page ${page} of ${totalPages}`}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-black hover:bg-gray-500 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* 👤 Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              👤 Employee Details
            </h2>
            <p className="mb-2 text-gray-700">
              <strong>Name:</strong> {selectedEmployee.name}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Email:</strong> {selectedEmployee.email}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Phone:</strong> {selectedEmployee.phone || "—"}
            </p>
            <p className="mb-2 text-gray-700">
              <strong>Department:</strong>{" "}
              {selectedEmployee.department?.name || "—"}
            </p>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <AddDepartmentModal
        isOpen={showDepartmentModal}
        onClose={() => setShowDepartmentModal(false)}
        onSuccess={(newDep) => setDepartments((prev) => [...prev, newDep])}
      />

      <CreateAdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
