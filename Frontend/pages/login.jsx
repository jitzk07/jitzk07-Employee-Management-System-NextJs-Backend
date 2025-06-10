import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "../services/auth";
import { setToken } from "../utils/auth";
import { redirectIfAuthenticated } from "../utils/redirectIfAuthenticated";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrView } from "react-icons/gr";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      redirectIfAuthenticated(router);
    }
  }, []);

  const handleLoginChange = (e) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdminChange = (e) => {
    setAdminForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(loginForm.email, loginForm.password);
      setToken(data.token);
      localStorage.setItem("userRole", data.role);
      toast.success("🎉 Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Login failed");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(
        adminForm.fullName,
        adminForm.email,
        adminForm.password
      );
      toast.success("✅ Admin account created successfully!");
      setAdminForm({ fullName: "", email: "", password: "" });
      setIsCreatingAdmin(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to create admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6e3] to-[#e1f5fe] px-4 py-10">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isCreatingAdmin ? " Create Admin" : "👤 Login"}
        </h2>

        {isCreatingAdmin ? (
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                value={adminForm.fullName}
                onChange={handleAdminChange}
                placeholder="John Doe"
                required
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={adminForm.email}
                onChange={handleAdminChange}
                placeholder="admin@example.com"
                required
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password 
              </label>
              <input
                name="password"
                type="password"
                value={adminForm.password}
                onChange={handleAdminChange}
                placeholder="Set a strong password"
                required
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#6FB1FC] hover:bg-[#589FF4] text-white py-3 rounded-lg font-medium transition"
            >
              Create Admin
            </button>
            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setIsCreatingAdmin(false)}
              >
                Login instead
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-300 p-3 rounded-lg bg-white text-black"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (default for user only :123456)
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 p-3 pr-10 rounded-lg bg-white text-black"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-600 hover:text-gray-800 cursor-pointer"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                <GrView />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#77DD77] hover:bg-[#66CC66] text-white py-3 rounded-lg font-medium transition"
            >
              Login
            </button>
            <p className="text-center mt-4 text-sm text-gray-600">
              Don&apos;t have an admin account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setIsCreatingAdmin(true)}
              >
                Create Admin
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
