import React, { createContext, useState, useEffect } from "react";

// 1. Create Context
export const AuthContext = createContext();

// 2. Create Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // user info
  const [token, setToken] = useState(null);     // auth token
  const [loading, setLoading] = useState(true); // initial load

  // Load saved auth state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // Sign in
  const signIn = (email, password, rememberMe) => {
    // Normally you'd call your backend API here
    // Example fake user:
    const fakeUser = { id: 1, email };
    const fakeToken = "sample_jwt_token";

    setUser(fakeUser);
    setToken(fakeToken);

    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(fakeUser));
      localStorage.setItem("token", fakeToken);
    } else {
      sessionStorage.setItem("user", JSON.stringify(fakeUser));
      sessionStorage.setItem("token", fakeToken);
    }
  };

  // Sign out
  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
