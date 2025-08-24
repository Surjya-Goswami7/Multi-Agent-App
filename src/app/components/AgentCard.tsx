"use client";
import React from "react";
import { motion } from "framer-motion";

type AgentCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGoClick: () => void;
};

const AgentCard = ({ title, description, icon, onGoClick }: AgentCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-between
                 bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-full h-full
                 border border-white/20 shadow-xl hover:shadow-2xl
                 transition-all duration-300 text-center"
    >
      {/* Glow effect behind icon */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 blur-2xl opacity-30" />

      {/* Icon */}
      <div className="relative w-16 h-16 flex items-center justify-center 
                      bg-gradient-to-r from-orange-500 to-pink-500 
                      text-white text-3xl rounded-2xl shadow-lg mb-4">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-100 drop-shadow-sm">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-300 mt-2 flex-grow">
        {description}
      </p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGoClick}
        className="mt-5 px-6 py-2 rounded-full text-white font-medium
                   bg-gradient-to-r from-orange-500 to-pink-500
                   shadow-md hover:shadow-lg transition-all"
      >
        Try Now
      </motion.button>
    </motion.div>
  );
};

export default AgentCard;
