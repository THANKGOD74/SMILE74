import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authApi';
//  expiry check
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // check expiry using jwt-decode
        const decoded = jwtDecode<{ exp: number }>(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          // Token expired – clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Token exists (and optionally valid) – load user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setToken(storedToken);
      } catch {
        // Invalid token – clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false); // always turn off loading
      }
    };

    validateToken();
  }, []); // runs once on mount

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiRegister(name, email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};



// import React, { createContext, useState, useContext, useEffect } from 'react';
// import type {  ReactNode } from 'react'
// import { login as apiLogin, register as apiRegister } from '../services/authApi';

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       // Optionally, fetch user profile using token to rehydrate
//       // For simplicity, we'll store user in localStorage too
//       const storedUser = localStorage.getItem('user');
//       if (storedUser) setUser(JSON.parse(storedUser));
//     }
//   }, [token]);

//   const login = async (email: string, password: string) => {
//     const data = await apiLogin(email, password);
//     setUser(data.user);
//     setToken(data.token);
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//   };

//   const register = async (name: string, email: string, password: string) => {
//     const data = await apiRegister(name, email, password);
//     setUser(data.user);
//     setToken(data.token);
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// };