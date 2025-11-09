import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { TokenManager } from "@/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const hasTokens = TokenManager.hasTokens();
      setIsAuthenticated(hasTokens);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Listen for auth logout events from API client
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string }) => {
    TokenManager.setTokens(tokens);
    setIsAuthenticated(true);
  };

  const logout = () => {
    TokenManager.clearTokens();
    setIsAuthenticated(false);

    // Only redirect if not already on sign-in page
    if (window.location.pathname !== "/sign-in") {
      window.location.href = "/sign-in";
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
