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
  error: null,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  setError: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let checkAuthTimeoutId: NodeJS.Timeout | null = null;

  const checkAuthUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a timeout promise that rejects after 10 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        checkAuthTimeoutId = setTimeout(() => {
          reject(new Error("Authentication check timed out"));
        }, 10000);
      });

      try {
        const currentAccount = await Promise.race([
          getCurrentUser(),
          timeoutPromise,
        ]);

        if (checkAuthTimeoutId) {
          clearTimeout(checkAuthTimeoutId);
          checkAuthTimeoutId = null;
        }

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
          setError(null);
          return true;
        }

        return false;
      } catch (raceError) {
        if (checkAuthTimeoutId) {
          clearTimeout(checkAuthTimeoutId);
          checkAuthTimeoutId = null;
        }
        throw raceError;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      console.error("checkAuthUser error:", errorMessage);
      setError(errorMessage);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let hasInitialized = false;

    const initializeAuth = async () => {
      if (hasInitialized) return;
      hasInitialized = true;

      try {
        // Wait for session to be restored from storage
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError.message);
          if (isMounted) {
            setError("Failed to restore session");
            setIsAuthenticated(false);
            setUser(INITIAL_USER);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          if (data?.session) {
            // Session exists, try to get user data
            await checkAuthUser();
          } else {
            // No session, user is not authenticated
            setIsAuthenticated(false);
            setUser(INITIAL_USER);
            setError(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Initialization failed";
        console.error("Auth initialization error:", errorMessage);
        if (isMounted) {
          setError(errorMessage);
          setIsAuthenticated(false);
          setUser(INITIAL_USER);
          setIsLoading(false);
        }
      }
    };

    // Listen for auth state changes and update context
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (!isMounted) return;

        try {
          if (event === "SIGNED_IN" && session) {
            await checkAuthUser();
          } else if (event === "SIGNED_OUT") {
            setUser(INITIAL_USER);
            setIsAuthenticated(false);
            setError(null);
            navigate("/sign-in", { replace: true });
          } else if (event === "INITIAL_SESSION") {
            // Session has been restored from storage
            if (session) {
              await checkAuthUser();
            } else {
              setIsAuthenticated(false);
              setUser(INITIAL_USER);
              setError(null);
              setIsLoading(false);
            }
          } else if (event === "USER_UPDATED") {
            // User data was updated, refresh context
            await checkAuthUser();
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Auth state change error";
          console.error("Auth state change error:", errorMessage);
          setError(errorMessage);
        }
      }
    );

    // Initial check on mount
    initializeAuth();

    // Cleanup listener on unmount
    return () => {
      isMounted = false;
      if (checkAuthTimeoutId) {
        clearTimeout(checkAuthTimeoutId);
      }
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
export const useAuthContext = useUserContext;
