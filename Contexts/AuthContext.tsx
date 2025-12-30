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
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { loading, error, user: reduxUser, isAuthenticated } = useAppSelector(
  (state: RootState) => state.auth
);


  const [user, setUser] = useState(reduxUser);

  // sync Redux user to context
  useEffect(() => {
    setUser(reduxUser);
  }, [reduxUser]);

  // restore user from AsyncStorage token
  const restoreUserFromToken = async () => {
    try {
      await dispatch(loadUserAction()); // update Redux
      console.log("User restored from token:", reduxUser);
      // setUser(reduxUser); // update context
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
