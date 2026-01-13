import React, { createContext, useState, useEffect, useContext } from "react";

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

  // Frontend-only login (no backend API call)
  const login = async (email, password) => {
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    // Find user with matching email and password
    const user = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const loggedInUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
      localStorage.setItem("clientUser", JSON.stringify(loggedInUser));
      setClientUser(loggedInUser);
      setIsClientLoggedIn(true);
      return { success: true, user: loggedInUser };
    } else {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("clientUser");
    setClientUser(null);
    setIsClientLoggedIn(false);
  };

  // Frontend-only signup (no backend API call)
  const signup = async (name, email, password, phone) => {
    // Get existing registered users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]"
    );

    // Check if email already exists
    const existingUser = registeredUsers.find((u) => u.email === email);
    if (existingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    // Add new user to localStorage
    const newUser = { name, email, password, phone };
    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    return {
      success: true,
      message: "Account created successfully! Please log in.",
      user: { name, email, phone },
    };
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
