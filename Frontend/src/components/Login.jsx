import React from 'react';

const Login = () => {
  return (
    <div className="flex justify-center items-center p-10 font-poppins bg-transparent">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl px-10 py-12">
        <h2 className="text-3xl font-semibold text-white text-center mb-8">
            Login to Your Account
        </h2>

        <form className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white/30 transition-all duration-300 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="********"
                className="w-full px-5 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white/30 transition-all duration-300 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-[#9B7EBD] to-[#3B1E54] hover:from-[#B89DE0] hover:to-[#4D2A70] text-white font-semibold rounded-xl transition duration-300 shadow-md hover:shadow-lg"
          >
            Log in
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-sm text-center text-white mt-6">
          Does not have any account?{' '}
          <a
            href="/login"
            className="text-violet-300 hover:text-violet-200 underline transition"
          >
            Sign Up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
