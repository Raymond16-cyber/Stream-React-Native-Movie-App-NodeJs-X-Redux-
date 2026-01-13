import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { RootState } from "@/store/store";
import { LOAD_USER } from "@/store/types/type"; // add this in your types
import { loadUserAction } from "@/store/actions/authAction";

type AuthContextType = {
  user: any; // Replace with your typed User if you have
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  restoreUserFromToken: () => Promise<void>;
  authChecked: boolean
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
 const { loading, error, user: reduxUser, isAuthenticated, authChecked } =
  useAppSelector((state: RootState) => state.auth);



  const [user, setUser] = useState(reduxUser);

  // sync Redux user to context
  useEffect(() => {
    setUser(reduxUser);
  }, [reduxUser]);

  // restore user from AsyncStorage token
 const restoreUserFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      return; // 🚫 No token → do nothing
    }

    await dispatch(loadUserAction());
  } catch (err) {
    console.warn("Failed to restore user from token", err);
  }
};


  return (
    <AuthContext.Provider
  value={{
    user,
    setUser,
    loading,
    error,
    restoreUserFromToken,
    isAuthenticated,
    authChecked
  }}
>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
