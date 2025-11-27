import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(null);

  const router = useRouter();

  // Load initial session + auth listener
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("AuthProvider: session changed");
        setSession(newSession);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch profile whenever session changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) {
        setProfile(null);
        return;
      }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      console.log("AuthProvider: profile", data);

      setProfile(data);
    };

    fetchProfile();
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
