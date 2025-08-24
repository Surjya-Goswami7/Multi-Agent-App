"use client";

import { useParams } from "next/navigation";
import { agents } from "app/utils/agentsConfig";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
// import { useCredits } from "app/context/authContext";
import Cookies from "js-cookie";

export default function AgentDetails() {
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  const [lookingFor, setLookingFor] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  // const { credits, setCredits } = useCredits();

  if (!agent)
    return <p className="text-center mt-10 text-red-500">Agent not found</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const creditRes = await fetch("/api/v1/deduct-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookingFor, location }),
        credentials: "include", // ✅ ensures cookie (token) is sent
      });

      if (!creditRes.ok) {
        toast.error("Session expired or request failed. Please log in again.");
        setLoading(false);
        return;
      }

      const creditData = await creditRes.json();

      if (creditData?.success) {
        toast.success("Credits deducted successfully!");
        // 🚀 Do your follow-up actions here (redirect, state updates, etc.)
      } else {
        toast.error(creditData?.message || "Failed to deduct credits.");
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
    <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-[#fdf6e3] to-[#fffaf0]">
      {/* Agent Icon */}
      <div className="bg-white p-6 rounded-full shadow-md mb-6">
        <Image
          src={agent.icon}
          alt={`${agent.name} icon`}
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-3 text-gray-800">
        {agent.name}
      </h1>
      {/* Description */}
      <p className="mb-8 max-w-2xl text-center text-gray-600">
        {agent.description}
      </p>
      {/* Scraping Info Section */}{" "}
      <div className="bg-yellow-50 p-4 rounded-lg mb-8 max-w-2xl text-left">
        {" "}
        <h3 className="text-xl text-gray-800 font-semibold mb-2">
          How this Agent Works
        </h3>{" "}
        <p className="text-gray-700 mb-2">
          {" "}
          This agent uses <span className="font-bold">web scraping</span> to
          automatically gather relevant information from multiple sources.{" "}
        </p>{" "}
        <p className="text-gray-700">
          {" "}
          Simply enter what you are looking for and the location, and the agent
          fetches results instantly.{" "}
        </p>{" "}
        <p className="text-gray-600 mt-2 italic text-sm">
          {" "}
          Scraping saves you time and ensures you always get accurate,
          up-to-date information.{" "}
        </p>{" "}
      </div>
      {/* Form */}
      <div className="border rounded-2xl p-6 max-w-lg w-full shadow-lg bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            className="w-full text-gray-600 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 text-gray-600 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <button
            type="submit"
            // disabled={loading || (credits !== null && credits < 2)}
            className="w-full px-8 py-3 bg-black text-white rounded-lg 
             hover:bg-gray-800 transition-all duration-300 
             disabled:bg-gray-400"
          >
            {loading ? "Fetching..." : "Submit"}
          </button>
        </form>
      </div>
      {/* Table */}
      {results.length > 0 && (
        <div className="mt-10 w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
              Results
            </h2>
            <button
              onClick={exportToExcel}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl shadow-md hover:from-green-500 hover:to-green-400 transition-all duration-300"
            >
              Export to Excel
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  {Object.keys(results[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-colors"
                  >
                    {Object.values(row).map((val, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
