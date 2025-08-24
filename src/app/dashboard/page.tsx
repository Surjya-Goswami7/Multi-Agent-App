"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AgentCard from "app/components/AgentCard";
import { agents } from "app/utils/agentsConfig";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "app/components/Loading";
export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<Boolean>(false)
  // Fetch user + credits
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/dashboard", {
          credentials: "include",
        });
        //fail safe if user not authenticated
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const result = await res.json();
        const data = result.userInfo;
        setUserName(data.name);
        setLoading(false);
        
      } catch (error) {
        toast.error("something went wrong")
        setLoading(false);
      }
  }

    fetchUser();
  }, [router]);

console.log('loading', loading)

  // Filter agents
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0f1a] to-[#1a1a2e] text-white">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start pt-10 px-4 sm:px-6 lg:px-12">
        {userName && (
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold 
               text-transparent bg-clip-text 
               bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
               mb-8 text-center"
          >
            Welcome! {userName}
          </h2>
        )}

        {/* Search Bar */}
        <div className="w-full max-w-md mb-8">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
          />
        </div>

        {/* Agent Cards */}
        {!loading ? <div className="grid mb-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl p-6 bg-gradient-to-br from-gray-900/60 to-black/40 border border-gray-700 backdrop-blur-lg shadow-lg hover:shadow-cyan-400/40 transition-all"
            >
              <AgentCard
                key={agent.id}
                title={agent.name}
                description={agent.description}
                icon={
                  <img
                    src={agent.icon}
                    alt={agent.name}
                    className="w-12 h-12 drop-shadow-glow"
                  />
                }
                onGoClick={() => router.push(`/agents/${agent.id}`)}
              />
            </motion.div>
          ))}
        </div>: <Loading size="lg" fullScreen={true}/>}
      </main>
    </div>
  );
}
