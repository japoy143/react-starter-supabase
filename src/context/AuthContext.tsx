import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import supabase from "../supabase-client";

// Define the shape of your context value
interface AuthContextType {
  session: any;
  setSession: (session: any) => void;
  signUpNewUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data: any }>;
  signOutUser: () => void;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data: any }>;
}

// Create context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Type the children prop
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<unknown>(undefined);

  //Sign Up
  const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("there was a problem signing up: ", error);
      return { success: false, data };
    }

    return { success: true, data };
  };

  //Sign In
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("sign in error: ", error);
        return { success: false, data };
      }

      console.log("successfully logged in", data);
      return { success: true, data };
    } catch (error) {
      console.error("an error occurred: ", error);
      return { success: false, data: {} };
    }
  };

  //Sign Out
  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("there was an error: ", error);
    }
  };

  //listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, setSession, signUpNewUser, signOutUser, signInUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
