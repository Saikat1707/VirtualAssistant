import React, { useState } from 'react';
import axios from '../service/AxiosInstance';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await axios.post('/auth/signup', formData);
      toast.success("Account created successfully!");
      navigate('/auth/login');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Signup failed. Please try again.";
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
      transition: { staggerChildren: 0.1 }
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
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
              Create Your Account
            </h2>
            <p className="text-center text-white/70 mb-8 text-sm md:text-base">
              Join us to get started with your personalized experience
            </p>
          </motion.div>

          <form className="space-y-5" onSubmit={handleFormSubmit}>
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label htmlFor="userName" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="John Doe"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm md:text-base rounded-lg bg-white/10 text-white placeholder-white/50 border ${
                    errors.userName ? 'border-red-400' : 'border-white/20'
                  } focus:outline-none focus:ring-2 focus:ring-[#9B7EBD] focus:bg-white/15 transition-all duration-200 shadow-sm`}
                />
                {errors.userName && (
                  <p className="mt-1 text-xs text-red-400">{errors.userName}</p>
                )}
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm md:text-base rounded-lg bg-white/10 text-white placeholder-white/50 border ${
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
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-sm md:text-base rounded-lg bg-white/10 text-white placeholder-white/50 border ${
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
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : "Sign Up"}
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center my-6">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-white/50 text-sm">OR</span>
            <div className="flex-grow border-t border-white/20"></div>
          </motion.div>

          {/* Login Link */}
          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-[#B89DE0] hover:text-[#D8C2FF] font-medium underline underline-offset-2 transition-colors"
              >
                Log in here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Terms and Privacy */}
        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-xs text-white/50">
            By signing up, you agree to our <a href="#" className="underline hover:text-white/70">Terms</a> and <a href="#" className="underline hover:text-white/70">Privacy Policy</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;