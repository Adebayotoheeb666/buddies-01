import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/config";

import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/supabase/api";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        await checkAuthUser();
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(INITIAL_USER);
        }
      }
    };

    // Listen for auth state changes and update context
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === "SIGNED_IN" && session) {
          await checkAuthUser();
        } else if (event === "SIGNED_OUT") {
          if (isMounted) {
            setUser(INITIAL_USER);
            setIsAuthenticated(false);
            navigate("/sign-in");
          }
        }
      }
    );

    // Initial check on mount
    initializeAuth();

    // Cleanup listener on unmount
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
export const useAuthContext = useUserContext;
