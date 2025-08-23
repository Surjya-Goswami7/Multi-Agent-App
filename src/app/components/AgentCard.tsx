import React from "react";

type AgentCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGoClick: () => void;
};

const AgentCard = ({ title, description, icon, onGoClick }: AgentCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-6 w-72 shadow-md hover:shadow-lg transition-all duration-200 text-center">
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full text-3xl mb-4">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-1">{description}</p>

      {/* Button */}
      <button
        onClick={onGoClick}
        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
      >
        Go
      </button>
    </div>
  );
};

export default AgentCard;
