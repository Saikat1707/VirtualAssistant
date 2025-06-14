import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../service/AxiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { motion } from 'framer-motion';
import { FiLogIn, FiMail, FiLock, FiLoader } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { isHaveAssistant, fetchUser } = useUserContext();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post("/auth/login", formData);
      toast.success("Login successful!");
      await fetchUser();
      
      if (isHaveAssistant) {
        toast.info("Redirecting to dashboard...");
        navigate("/");
      } else {
        navigate("/customization/dummy");
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 font-poppins bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-6 py-8 md:px-10 md:py-12"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#9B7EBD]/20 rounded-full">
                <FiLogIn className="text-3xl text-[#9B7EBD]" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white/70 text-sm md:text-base">
              Sign in to continue to your account
            </p>
          </motion.div>

          <form className="space-y-5" onSubmit={handleFormSubmit}>
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 text-sm md:text-base rounded-lg bg-white/10 text-white placeholder-white/50 border ${
                    errors.email ? 'border-red-400' : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-[#9B7EBD] focus:bg-white/15 transition-all duration-200 shadow-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <Link 
                  to="/auth/forgot-password" 
                  className="text-xs text-[#B89DE0] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 text-sm md:text-base rounded-lg bg-white/10 text-white placeholder-white/50 border ${
                    errors.password ? 'border-red-400' : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-[#9B7EBD] focus:bg-white/15 transition-all duration-200 shadow-sm`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#9B7EBD] to-[#6A4B8B] hover:from-[#B89DE0] hover:to-[#8A6BBE] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Logging in...
                  </>
                ) : "Log in"}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center my-6">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/50 text-sm">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-white/70">
              Don't have an account?{' '}
              <Link
                to="/auth/signup"
                className="text-[#B89DE0] hover:text-[#D8C2FF] font-medium underline underline-offset-2 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;