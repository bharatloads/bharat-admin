"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Admin {
  id: string;
  username: string;
  phone: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, adminData: Admin) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken =
        localStorage.getItem("adminToken") || Cookies.get("adminToken");
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        if (isValid) {
          setToken(storedToken);
          setIsAuthenticated(true);
          // If we're on the login page, redirect to dashboard
          if (window.location.pathname.startsWith("/login")) {
            router.push("/dashboard");
          }
        } else {
          // If token is invalid, clear everything
          await logout();
        }
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateToken = async (authToken: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  const login = (newToken: string, adminData: Admin) => {
    setToken(newToken);
    setAdmin(adminData);
    setIsAuthenticated(true);
    // Store in both localStorage and cookies
    localStorage.setItem("adminToken", newToken);
    Cookies.set("adminToken", newToken, { expires: 7 }); // Expires in 7 days
  };

  const logout = async () => {
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);
    // Clear from both localStorage and cookies
    localStorage.removeItem("adminToken");
    Cookies.remove("adminToken");
    sessionStorage.removeItem("adminUsername");
    router.push("/login");
  };

  const checkAuth = async () => {
    if (!token) return false;
    return await validateToken(token);
  };

  if (isLoading) {
    // You might want to show a loading spinner here
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
