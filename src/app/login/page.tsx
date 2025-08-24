"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    setSlideIn(true);
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    } else if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return false;
    } else if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login Error", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <div
        className={`relative bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/30 transform transition-transform duration-700 ease-in-out ${
          slideIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Decorative Gradient Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 animate-pulse"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-lg">
            Multi-Agent App
          </h2>
          <p className="text-center text-sm text-gray-200 mt-2 mb-6">
            Please login to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-300 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Links */}
            <p className="text-center text-gray-200 text-sm">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-yellow-300 hover:underline font-semibold"
              >
                Create here
              </Link>
            </p>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition duration-300"
            >
              Login
            </button>

            <p className="text-center mt-3 text-sm">
              <span className="text-gray-200">Forgot Password?</span>{" "}
              <Link
                href="/forgot-password"
                className="text-yellow-300 hover:underline font-semibold"
              >
                Reset Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}