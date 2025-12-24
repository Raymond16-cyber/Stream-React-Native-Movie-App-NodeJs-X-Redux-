import { ID } from "appwrite";
import { account } from "./appwrite";
import { useAuth } from "@/Contexts/AuthContext";

/**
 * Get currently logged-in user (if session exists)
 */
export async function getCurrentUser() {
  try {
    const acc = await account.get();
    return acc
  } catch {
    return null;
  }
}

/**
 * Register a new user
 */
type RegData = {
  email: string;
  password: string;
  name: string;
};

export async function RegisterUser(data: RegData) {
  try {
    const { email, password, name } = data;

    await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    console.log("User registered");
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Login → creates a session
 */
type LoginData = {
  email: string;
  password: string;
};

export async function loginUser(data: LoginData) {
  try {
    const { email, password } = data;

    const session = await account.createEmailPasswordSession(
      email,
      password
    );
    console.log("session login",session)
    return session;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Logout → deletes current session
 */
export async function logoutUser() {
  try {
    await account.deleteSession("current");
     
    console.log("logout successful");
    
  } catch (error) {
    console.error("Logout error:", error);
  }
}

