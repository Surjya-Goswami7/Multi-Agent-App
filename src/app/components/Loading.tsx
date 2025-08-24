"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type LoadingProps = {
  size?: "sm" | "md" | "lg" | "xl"; // optional size prop
  fullScreen?: boolean; // for full-page loading
};

export default function Loading({ size = "md", fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-4",
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        fullScreen ? "w-screen h-screen" : "w-full h-full min-h-[60px]"
      )}
    >
      <motion.div
        className={clsx(
          "border-t-transparent border-blue-500 rounded-full",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
