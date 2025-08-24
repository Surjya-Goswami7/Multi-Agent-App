"use client";

import { useParams } from "next/navigation";
import { agents } from "app/utils/agentsConfig";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { useAuth } from "app/context/authContext";
export default function AgentDetails() {
  const { updateCredits, user } = useAuth();
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  const [lookingFor, setLookingFor] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  if (!agent){
    return <p className="text-center mt-10 text-red-500">Agent not found</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const creditRes = await fetch("/api/v1/deduct-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookingFor, location }),
        credentials: "include",
      });

      if (!creditRes.ok) {
        toast.error("Session expired or request failed. Please log in again.");
        setLoading(false);
        return;
      }

      const creditData = await creditRes.json();
      console.log('creditData', creditData)
      if (creditData.status === 200) {
        toast.success(creditData.message);
         if (user) {
          updateCredits(user.outstandingCredits - 2); 
        }
        //calling the webhook here
        if (agent?.webhookUrl) {
          try {
            const webhookRes = await fetch(agent.webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ lookingFor, location }), // send input data
            });

            if (!webhookRes.ok) {
              throw new Error("Webhook request failed");
            }

            const webhookData = await webhookRes.json();
            setResults(webhookData);
          } catch (err) {
            console.error("Webhook error:", err);
            toast.error("Failed to fetch data from agent webhook.");
          }
        }
      } else {
        toast.error(creditData.message || "Failed to deduct credits.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, `${agent.name}-data.xlsx`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* Agent Icon */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 rounded-full shadow-lg mb-6"
      >
        <Image
          src={agent.icon}
          alt={`${agent.name} icon`}
          width={90}
          height={90}
          className="rounded-full"
        />
      </motion.div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
        {agent.name}
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-2xl text-center text-gray-300">
        {agent.description}
      </p>

      {/* Scraping Info */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 p-6 rounded-2xl mb-10 max-w-2xl text-left shadow-lg border border-purple-700/30">
        <h3 className="text-xl font-semibold mb-3 text-cyan-300">
          How this Agent Works
        </h3>
        <p className="text-gray-300 mb-2">
          This agent uses <span className="font-bold text-purple-300">web scraping</span> to
          automatically gather relevant information from multiple sources.
        </p>
        <p className="text-gray-300">
          Simply enter what you are looking for and the location, and the agent
          fetches results instantly.
        </p>
        <p className="text-sm italic mt-3 text-gray-400">
          Scraping saves you time and ensures you always get accurate,
          up-to-date information.
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border border-gray-700 bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-lg w-full shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition duration-300"
          >
            {loading ? "Fetching..." : "Submit"}
          </button>
        </form>
      </motion.div>

      {/* Results Table */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 w-full max-w-6xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-cyan-400">Results</h2>
            <button
              onClick={exportToExcel}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition"
            >
              Export to Excel
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700 bg-white/10 backdrop-blur-lg">
            <table className="min-w-full divide-y divide-gray-700 text-white">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-700">
                <tr>
                  {Object.keys(results[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider text-cyan-400"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {results.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/20 transition"
                  >
                    {Object.values(row).map((val, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-200"
                      >
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
