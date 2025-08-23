"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AgentCard from "app/components/AgentCard";
import { agents } from "app/utils/agentsConfig";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [credits, setCredits] = useState(0); // ✅ local state for credits
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [fullText, setFullText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user data and credits
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/v1/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const result = await res.json();
      const data = result.userInfo;
      setUserName(data.name);

      // Fetch credits from credit-users API
      const credRes = await fetch(
        `http://localhost:3000/api/v1/deduct-users?email=${data.email}`
      );
      const creditData = await credRes.json();
      setCredits(creditData.credits ?? 0);

      // Animated welcome text
      const text = `Welcome, ${data.name}!`;
      setFullText(text);

      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index === text.length) clearInterval(interval);
      }, 50);
    }

    fetchUser();
  }, [router]);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Filter agents
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf6e3] text-black">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-black via-gray-900 to-black shadow-lg">
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-md transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
              {userName ? userName.charAt(0).toUpperCase() : "?"}
            </div>
            <span className="hidden sm:inline font-semibold">
              {userName || "Profile"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
              <div className="p-4 flex flex-col items-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-2 shadow">
                  {userName ? userName.charAt(0).toUpperCase() : "?"}
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {userName}
                </p>
                <p className="text-sm text-gray-500">{credits} credits left</p>
              </div>

              <div className="border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-red-600 font-medium hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-start pt-8 px-4 sm:px-6 lg:px-12">
        {/* Animated Welcome */}
        <div className="flex justify-center">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono whitespace-pre mb-6"
            style={{ width: `${fullText.length}ch`, fontFamily: "monospace" }}
          >
            {displayedText}
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
          Featured Agents
        </h2>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              title={agent.name}
              description={agent.description}
              icon={
                <img src={agent.icon} alt={agent.name} className="w-10 h-10" />
              }
              onGoClick={() => router.push(`/agents/${agent.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
