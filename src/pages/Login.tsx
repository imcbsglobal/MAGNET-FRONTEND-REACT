import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.api";
import { useAuthStore } from "../stores/useAuthStore";
import { useLoadingStore } from "../stores/useLoadingStore";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();
  const { setLoading } = useLoadingStore();

  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-[500px] mx-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2c7be5]">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-400 rounded-md outline-none focus:border-[#2c7be5] focus:ring-2 focus:ring-[#2c7be5] transition-all duration-200"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-400 rounded-md outline-none focus:border-[#2c7be5] focus:ring-2 focus:ring-[#2c7be5] transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={clsx(
                  "absolute right-3 top-1/2 -translate-y-1/2 text-2xl cursor-pointer transition",
                  showPassword
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#2c7be5] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
