"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
export default function LandingPage() {
    const router = useRouter();
    const handleExploreClick = async () => {
    try {
      // Hit a small API endpoint that just verifies the token from cookies
      const res = await fetch("/api/v1/auth/check", {
        method: "GET",
        credentials: "include", // ensures cookies are sent
      });

      if (res.ok) {
        // ✅ User is logged in → go to dashboard
        router.push("/dashboard");
      } else {
        //Not logged in → go to login
        router.push("/login");
      }
    } catch (err) {
      console.error("Error checking auth:", err);
      router.push("/login");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-[#fff7eb]">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12">
          {/* Left Content */}
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Multi Agent App
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
              Automate your workflow with powerful AI-powered agents. 
              Scrape, monitor, track, and analyze — all in one futuristic dashboard.
            </p>
            <div className="space-x-4">
              <button
                onClick={handleExploreClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition"
              >
                Explore Now
              </button>
              <Link
                href="#features"
                className="bg-white/10 hover:bg-white/20 border border-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition"
              >
                Details
              </Link>
            </div>
          </div>

          {/* Right Side Graphic */}
          <div className="mt-10 md:mt-0 relative">
            <div className="w-72 h-72 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 rounded-full blur-3xl opacity-70 animate-pulse absolute -z-10"></div>
            <img
              src="/updated-multi.jpg"
              alt="Dashboard Preview"
              className="rounded-2xl shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12">
          Why Choose <span className="text-orange-500">Multi Agent App?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-white shadow-lg rounded-2xl hover:scale-105 transition">
            <span className="text-5xl">🤖</span>
            <h3 className="text-xl text-gray-800 font-semibold mt-4">AI-Powered Agents</h3>
            <p className="text-gray-600 mt-2">
              Deploy agents for scraping, monitoring, and data analysis instantly.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl hover:scale-105 transition">
            <span className="text-5xl">⚡</span>
            <h3 className="text-xl text-gray-800 font-semibold mt-4">Fast & Scalable</h3>
            <p className="text-gray-600 mt-2">
              Built for performance, scale seamlessly as your needs grow.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-2xl hover:scale-105 transition">
            <span className="text-5xl">🌐</span>
            <h3 className="text-xl text-gray-800 font-semibold mt-4">All-in-One Dashboard</h3>
            <p className="text-gray-600 mt-2">
              Manage all your agents in a futuristic, user-friendly dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] py-16 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Supercharge Your Workflow?
        </h2>
        <Link
          href="/signup"
          className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition"
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}
