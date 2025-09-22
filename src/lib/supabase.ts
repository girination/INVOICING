import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dgzqohvdjimtoriwhmki.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnenFvaHZkamltdG9yaXdobWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzIxMTIsImV4cCI6MjA3NDEwODExMn0.d1ztRcJ9xbUCgOTrMm-cAWTvZ0BUlFk6W_X1FMDZILM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (
    email: string,
    password: string,
    userData?: {
      first_name?: string;
      last_name?: string;
      company?: string;
    }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
