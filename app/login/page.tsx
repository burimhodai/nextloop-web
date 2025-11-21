"use client";
import { useState } from 'react';
import { CloudCog, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

 const handleSubmit = async () => {
  try {
    const res = await axios.post(
      "https://gscwqtwd-5000.euw.devtunnels.ms/api/user/login",
      formData
    );

    const { token, user } = res.data.data;

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("Saved to localStorage:", { token, user });
    
    // Optional: redirect user
    // router.push("/dashboard");

  } catch (error) {
    console.error("Login error:", error);
  }
};


  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-[#3a3735] flex items-center justify-center">
              <span className="text-[#c8a882] text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>N</span>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#3a3735] text-2xl tracking-tight">
              NextLoop
            </span>
          </div>
          <h1 className="text-2xl text-[#3a3735] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Welcome Back
          </h1>
          <p className="text-sm text-[#5a524b]">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-[#e8dfd0] p-8 shadow-sm">
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm text-[#3a3735] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm text-[#3a3735] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a524b] hover:text-[#3a3735] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-[#d4cec4] text-[#3a3735] focus:ring-[#c8a882]"
                />
                <span className="text-sm text-[#5a524b]">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#c8a882] hover:text-[#3a3735] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] py-3 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e8dfd0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#5a524b]">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[#5a524b]">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-[#c8a882] hover:text-[#3a3735] transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-[#5a524b] hover:text-[#3a3735] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}