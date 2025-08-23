"use client";

import { jwtVerify } from "jose";
import { createContext, useContext, useState, useEffect } from "react";
const SECRET_KEY =
  process.env.JWT_SECRET || "GD2ZHOx+xUndTGscaQk7rCb8okinfYnVK8OfqpFES5o=";

type CreditsContextType = {
  credits: number | null;
  setCredits: (val: number | null) => void;
  fetchCredits: () => Promise<void>;
};

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("token", token);
      if (!token) return;
      const secret = new TextEncoder().encode(SECRET_KEY);
      const { payload } = await jwtVerify(token, secret);
      console.log("payload", payload);

      //   const userData = JSON.parse(atob(token.split(".")[1]));
      const userId = payload?.userId;

      const res = await fetch(
        `http://localhost:3000/api/v1/credit-users/${userId}`
      );
      const data = await res.json();
      setCredits(10);
    } catch (err) {
      console.error("Failed to fetch credits", err);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <CreditsContext.Provider value={{ credits, setCredits, fetchCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used inside CreditsProvider");
  }
  return context;
};
