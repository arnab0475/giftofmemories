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

  const login = (userData) => {
    // Mock login
    const user = { ...userData, id: 1, name: "Valued Customer" };
    localStorage.setItem("clientUser", JSON.stringify(user));
    setClientUser(user);
    setIsClientLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("clientUser");
    setClientUser(null);
    setIsClientLoggedIn(false);
  };

  const signup = (userData) => {
    // Mock signup - logic same as login for client-side demo
    const user = {
      ...userData,
      id: Date.now(),
      name: userData.name || "New User",
    };
    localStorage.setItem("clientUser", JSON.stringify(user));
    setClientUser(user);
    setIsClientLoggedIn(true);
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
