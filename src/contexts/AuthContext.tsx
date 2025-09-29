import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as AppUser } from '../types/auth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: AppUser[] = [
  {
    id: 'admin-1',
    email: 'admin@lab.com',
    full_name: 'Mr. Amit kumar',
    role: 'admin',
    department: 'Administration',
    phone: '+91 98765 43210',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true
  },
  {
    id: 'tech-1',
    email: 'tech@lab.com',
    full_name: 'Roshan kumar',
    role: 'technician',
    department: 'Maintenance',
    phone: '+91 98765 43211',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true
  },
  {
    id: 'staff-1',
    email: 'staff@lab.com',
    full_name: 'Ramanpreet kaur',
    role: 'staff',
    department: 'Chemistry',
    phone: '+91 98765 43212',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_active: true
  }
];
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('lab-auth-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('lab-auth-user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in production, this would validate against a real backend
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('lab-auth-user', JSON.stringify(foundUser));
      return { error: null };
    } else {
      return { error: { message: 'Invalid email or password' } };
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    // Mock sign up - create a new user
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      return { error: { message: 'User already exists' } };
    }
    
    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: metadata.full_name,
      role: metadata.role || 'staff',
      department: metadata.department,
      phone: metadata.phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('lab-auth-user', JSON.stringify(newUser));
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('lab-auth-user');
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    // Mock password reset
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      return { error: null };
    } else {
      return { error: { message: 'User not found' } };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
