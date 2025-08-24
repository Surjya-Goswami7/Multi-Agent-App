"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left side - Logo / App name */}
        <img
          src="/mutil-ai-logo.png"
          alt="Multi-Agent Logo"
          className="w-10 h-10 rounded-lg shadow-lg border border-gray-200"
        />

        {/* Center - Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/about" className="hover:text-white transition">
            About
          </a>
          <a href="/contact" className="hover:text-white transition">
            Contact
          </a>
          <a href="/privacy-policy" className="hover:text-white transition">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white transition">
            Terms
          </a>
        </div>

        {/* Right side - Copy */}
        <div className="mt-4 md:mt-0 text-sm">
          © {new Date().getFullYear()} Multi-Agent App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
