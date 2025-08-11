// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // On mount: check the login cookie
  useEffect(() => {
    const loginCookie = Cookies.get("login");
    if (loginCookie === "true") {
      // Optionally, you can verify session/token by API here as well
      setIsAuthenticated(true);
      // Optionally retrieve user info here with an API if needed
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData || null);
    Cookies.set("login", "true", { expires: 7, sameSite: "lax" }); // keep for 7 days
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        "https://advertiserappnew.onrender.com/adv/auth/logOut",
        {},
        { withCredentials: true }
      );
    } catch (error) {}
    Cookies.remove("login");
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
