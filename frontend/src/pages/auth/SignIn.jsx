import React, { useState, useEffect, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const SignIn = () => {
  const { updateUser } = useContext(UserContext); // ✅ access context
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      const response = await axiosInstance.post("/api/v1/auth/login", { email, password });

      // Save token in localStorage
      localStorage.setItem("token", response.data.token);

      // Update user in context ✅
      updateUser(response.data.user);

      // Remember email if needed
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[80%] h-full bg-white shadow-xl rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
        {/* Heading */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Welcome Back 👋</h3>
          <p className="text-sm text-slate-600 mt-2">Sign in to continue tracking your expenses</p>
        </div>

        {/* Server Error */}
        {serverError && <p className="text-xs text-red-500 mb-2 text-center">{serverError}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm text-gray-800 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm text-gray-800 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-start text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-purple-600 cursor-pointer text-white font-medium rounded-xl shadow-md transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-500/90"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
