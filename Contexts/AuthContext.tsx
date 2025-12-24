import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks/useAppDispatch";
import { RootState } from "@/store/store";
import { LOAD_USER } from "@/store/types/type"; // add this in your types

type AuthContextType = {
  user: any; // Replace with your typed User if you have
  loading: boolean;
  error: string | null;
  setUser: (user: any) => void;
  restoreUserFromToken: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { loading, error, user: reduxUser } = useAppSelector(
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
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
        setUser(payload); // update context
        dispatch({ type: LOAD_USER, payload: { user: payload, token } }); // update Redux
      }
    } catch (err) {
      console.warn("Failed to restore user from token", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, error, restoreUserFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
