export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'technician' | 'staff' | 'guest';
  department?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  full_name: string;
  role: 'staff' | 'technician';
  department?: string;
  phone?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}