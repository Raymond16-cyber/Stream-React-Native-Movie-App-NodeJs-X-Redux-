import { getCurrentUser } from "@/services/useAuth";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  loading: boolean;
  refreshUser: () => Promise<void>;
  refUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    const u = await getCurrentUser();
    setUser(u);
    setLoading(false);
  };

  const refUser = async () => {
    // setLoading(true);
    const u = await getCurrentUser();
    setUser(u);
    // setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser,refUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
