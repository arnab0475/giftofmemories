import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const ClientAuthContext = createContext();

export const useClientAuth = () => useContext(ClientAuthContext);

export const ClientAuthProvider = ({ children }) => {
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientUser, setClientUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem("clientUser");
    if (storedUser) {
      setClientUser(JSON.parse(storedUser));
      setIsClientLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/users/login`,
        { email, password }
      );
      const user = res.data.user;
      localStorage.setItem("clientUser", JSON.stringify(user));
      setClientUser(user);
      setIsClientLoggedIn(true);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("clientUser");
    setClientUser(null);
    setIsClientLoggedIn(false);
  };

  const signup = async (name, email, password, phone) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/users/signup`,
        { name, email, password, phone }
      );
      return {
        success: true,
        message: res.data.message,
        user: res.data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  return (
    <ClientAuthContext.Provider
      value={{
        isClientLoggedIn,
        clientUser,
        login,
        logout,
        signup,
        isLoading,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};
