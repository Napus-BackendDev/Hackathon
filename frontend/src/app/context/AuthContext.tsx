import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type UserRole = 'CODER' | 'DOCTOR' | 'PATIENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock user based on email
      let user: User | null = null;

      if (email === 'coder@hospital.com' && password === 'password') {
        user = {
          id: '1',
          email: 'coder@hospital.com',
          name: 'Medical Coder',
          role: 'CODER'
        };
      } else if (email === 'doctor@hospital.com' && password === 'password') {
        user = {
          id: '2',
          email: 'doctor@hospital.com',
          name: 'Dr. Smith',
          role: 'DOCTOR'
        };
      } else if (email === 'patient@hospital.com' && password === 'password') {
        user = {
          id: '3',
          email: 'patient@hospital.com',
          name: 'John Patient',
          role: 'PATIENT'
        };
      } else if (email === 'admin@hospital.com' && password === 'password') {
        user = {
          id: '4',
          email: 'admin@hospital.com',
          name: 'Admin User',
          role: 'ADMIN'
        };
      } else {
        throw new Error('Invalid email or password');
      }

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
