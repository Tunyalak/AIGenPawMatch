export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  googleId?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  expiresAt?: number; // Unix timestamp
}
