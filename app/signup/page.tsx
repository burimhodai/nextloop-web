"use client";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = () => {
    // Handle signup logic here
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Sign up submitted:', formData);
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
            Create Account
          </h1>
          <p className="text-sm text-[#5a524b]">
            Join NextLoop and start your journey
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white border border-[#e8dfd0] p-8 shadow-sm">
          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm text-[#3a3735] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all"
                placeholder="John Doe"
              />
            </div>

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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-[#3a3735] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f5f1ea] border border-[#d4cec4] text-[#3a3735] text-sm focus:outline-none focus:border-[#c8a882] focus:bg-white transition-all pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a524b] hover:text-[#3a3735] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 border-[#d4cec4] text-[#3a3735] focus:ring-[#c8a882]"
                />
                <span className="text-sm text-[#5a524b]">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#c8a882] hover:text-[#3a3735] transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#c8a882] hover:text-[#3a3735] transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#3a3735] hover:bg-[#c8a882] text-[#faf8f4] hover:text-[#3a3735] py-3 transition-colors font-medium"
            >
              Create Account
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

          {/* Login Link */}
          <p className="text-center text-sm text-[#5a524b]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#c8a882] hover:text-[#3a3735] transition-colors font-medium"
            >
              Sign in
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