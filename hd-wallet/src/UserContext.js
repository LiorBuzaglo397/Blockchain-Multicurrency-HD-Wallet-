import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userData")));

  const login = (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
