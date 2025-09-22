import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import {
  AuthController,
  AuthControllerResponse,
} from "@/controllers/auth.controller";
import { AuthService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<AuthControllerResponse<{ user: User; session: Session }>>;
  signUp: (
    email: string,
    password: string,
    userData?: {
      first_name?: string;
      last_name?: string;
      company?: string;
    }
  ) => Promise<AuthControllerResponse<{ user: User; session: Session }>>;
  signOut: () => Promise<AuthControllerResponse<null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const response = await AuthController.getCurrentSession();
      if (!response.success) {
        console.error("Error getting session:", response.error);
      } else {
        setSession(response.data?.session || null);
        setUser(response.data?.session?.user ?? null);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return await AuthController.signIn({ email, password });
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: {
      first_name?: string;
      last_name?: string;
      company?: string;
    }
  ) => {
    return await AuthController.signUp({ email, password, userData });
  };

  const signOut = async () => {
    return await AuthController.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
