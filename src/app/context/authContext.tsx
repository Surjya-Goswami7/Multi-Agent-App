"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
} | null;// since /api/check does not return user info, only loggedIn boolean

type AuthContextType = {
  user: User;
  loggedIn: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(null);
  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/check", {
        credentials: "include",
      });

      // if (!res.ok) {
      //   setUser(null);
      //   setLoggedIn(false);
      //   return;
      // }

      const data = await res.json();
      console.log('data', data);
      setLoggedIn(data.loggedIn || false);
      setUser(data.user || null);
    } catch (err) {
      setUser(null);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setLoggedIn(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loggedIn, loading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
