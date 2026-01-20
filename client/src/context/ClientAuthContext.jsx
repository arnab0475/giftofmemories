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

  // Backend API login
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/users/login`,
        { email, password }
      );

      const userData = response.data.user;
      const loggedInUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        discount: userData.discount,
      };

      localStorage.setItem("clientUser", JSON.stringify(loggedInUser));
      setClientUser(loggedInUser);
      setIsClientLoggedIn(true);

      return { success: true, user: loggedInUser };
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

  // Backend API signup
  const signup = async (name, email, password, phone) => {
    try {
      console.log("Signup attempt:", { name, email, phone });
      console.log(
        "API URL:",
        `${import.meta.env.VITE_NODE_URL}/api/users/signup`
      );

      const response = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/users/signup`,
        { name, email, password, phone }
      );

      console.log("Signup response:", response.data);
      return {
        success: true,
        message:
          response.data.message || "Account created! Awaiting admin approval.",
      };
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Signup failed",
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
