import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "professional" | "student" | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      const { data: student } = await supabase
        .from("students")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (student) {
        return "student";
      }

      const { data: professional } = await supabase
        .from("professionals")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (professional){
        return "professional";
      } 

      return null;
    } catch (error) {
      console.error("Erro ao buscar role do usuário:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async (session: Session | null) => {
      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const foundRole = await fetchUserRole(currentUser.id);
          setRole(foundRole);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Erro na inicialização da autenticação:", error);
      } finally {
        setLoading(false);
      }
    };
      
    supabase.auth.getSession().then(({ data: { session } }) => {
      initializeAuth(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setRole(null);
        setLoading(false);
      } else {
        initializeAuth(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setUser(null);
    setRole(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
