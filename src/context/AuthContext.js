import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('Admin');

  const changeRole = (role) => setUserRole(role);

  return (
    <AuthContext.Provider value={{ userRole, changeRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
