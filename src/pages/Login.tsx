import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-[500px] mx-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2c7be5]">
          Login
        </h2>

        <form className="space-y-6">
          {/* Username */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-3 border border-gray-400 rounded-md outline-none focus:border-[#2c7be5] focus:ring-2 focus:ring-[#2c7be5] transition-all duration-200"
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
                className="w-full px-4 py-3 border border-gray-400 rounded-md outline-none focus:border-[#2c7be5] focus:ring-2 focus:ring-[#2c7be5] transition-all duration-200"
              />
              <button
                type="button"
                className="absolute right-3 text-2xl top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
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
