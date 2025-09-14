import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Mail, Lock, Eye, EyeOff, User, Camera } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import uploadImage from "../../utils/uploadImage";
import { API_PATHS } from "../../utils/apiPaths";

const SignUp = () => {
  const { updateUser } = useContext(UserContext); // <-- updated
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Full name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log("Submitting signup form...");

      let profileImageUrl = null;
      if (profilePic) {
        console.log("Uploading profile picture...");
        const uploadRes = await uploadImage(profilePic);
        console.log("Upload response:", uploadRes);
        profileImageUrl = uploadRes.imageUrl;
      }

      const formData = { fullName: name, email, password, profileImageUrl };
      console.log("Form data prepared:", formData);

      // Register user
      const registerRes = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      console.log("Register response:", registerRes.data);

      const token = registerRes.data.token;
      console.log("Received token:", token);
      localStorage.setItem("token", token);
      console.log("Token saved in localStorage.");

      // Fetch user info
      console.log("Fetching user info with token...");
      const userRes = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      console.log("User info response:", userRes.data);

      // Update UserContext
      updateUser(userRes.data);
      console.log("UserContext updated via updateUser.");

      navigate("/dashboard");
    } catch (err) {
      console.error("Signup flow error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[80%] h-full bg-white shadow-xl rounded-2xl p-8 flex flex-col justify-center items-center gap-6">
        {/* Heading */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Create an Account ✨</h3>
          <p className="text-sm text-slate-600 mt-2">Sign up to start tracking your expenses</p>
        </div>

        {/* Profile Picture Upload */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-purple-200 overflow-hidden shadow-md flex items-center justify-center bg-gray-50">
            {preview ? (
              <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profilePic"
            className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-purple-500 transition"
          >
            <Camera className="w-5 h-5 text-white" />
          </label>
          <input type="file" id="profilePic" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm text-gray-800 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-sm text-gray-800 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-purple-600 cursor-pointer text-white font-medium rounded-xl shadow-md transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-500/90"
            }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Link to Sign In */}
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
