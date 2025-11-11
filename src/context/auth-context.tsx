import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { onAuthStateChange, logout as firebaseLogout, getCurrentUserProfile } from "@/api/firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import type { UserProfile } from "@/api/firebase/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  logout: () => Promise<void>;
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Get user profile from Firestore
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);

        // Store token in localStorage
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("ucp_token", token);
        if (firebaseUser.refreshToken) {
          localStorage.setItem("ucp_refresh_token", firebaseUser.refreshToken);
        }

        // Store user profile in localStorage
        if (profile) {
          localStorage.setItem("ucp_user", JSON.stringify({
            uuid: profile.uuid,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            rank: profile.rank,
            serviceNumber: profile.serviceNumber,
            unit: profile.unit,
            avatar: profile.avatar,
          }));
        }
      } else {
        // Clear everything on logout
        setUserProfile(null);
        localStorage.removeItem("ucp_user");
        localStorage.removeItem("ucp_token");
        localStorage.removeItem("ucp_refresh_token");
        localStorage.removeItem("ucp_remember");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseLogout();
      // State cleanup happens in onAuthStateChange listener
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    userProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
