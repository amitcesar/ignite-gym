import { createContext } from "react";

interface AuthContextType {
  name: string;
  email: string;
  password: string;
}
export const AuthContext = createContext({} as AuthContextType);
