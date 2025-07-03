import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.api";
import { useAuthStore } from "../stores/useAuthStore";
import { useLoadingStore } from "../stores/useLoadingStore";
import logo from "../assets/logo-dummy.png";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const { setLoading } = useLoadingStore();

  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<"teacher" | "parent">("teacher");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ id: userId.trim(), pass: password.trim() });
      setToken(res.token);
      setUser(res.user_id);

      navigate("/marks");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Login failed.");
      } else {
        setError("Something went wrong. Check connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-[900px] min-h-[500px]">
        {/* Left Side */}
        <div className="md:w-1/2 w-full flex flex-col items-center justify-center p-8 bg-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
          <img src={logo} alt="Logo" className="w-20 mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#fb923c] mb-2">
            MAGNET SCHOOL
          </h1>
          <p className="text-black text-center">
            Welcome to the School Management Portal
          </p>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-full flex flex-col items-center justify-center p-8 bg-[#fb923c] rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center bg-white p-1 rounded-full">
              <button
                onClick={() => setRole("parent")}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 ${
                  role === "parent"
                    ? "bg-[#fde047] text-black"
                    : "text-[#fb923c] hover:bg-[#fde047]/30"
                }`}
              >
                Parent
              </button>
              <button
                onClick={() => setRole("teacher")}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 ${
                  role === "teacher"
                    ? "bg-[#fde047] text-black"
                    : "text-[#fb923c] hover:bg-[#fde047]/30"
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 w-full max-w-[400px] transition-all duration-500"
          >
            {/* Username / Admission */}
            <input
              type="text"
              onChange={(e) => setUserId(e.target.value)}
              placeholder={role === "parent" ? "Admission Number" : "Username"}
              className="w-full px-4 py-3 border-2 border-white rounded-md bg-transparent placeholder-white text-white focus:outline-none focus:border-[#fde047] transition-all"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border-2 border-white rounded-md bg-transparent placeholder-white text-white focus:outline-none focus:border-[#fde047] transition-all"
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
              </div>
            </div>
            <button className="w-full py-2 bg-[#fde047] hover:bg-yellow-400 text-black rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer">
              {role === "parent" ? "Parent Login" : "Teacher Login"}
            </button>
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
