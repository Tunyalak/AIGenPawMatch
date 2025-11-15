import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, AuthState } from '../models/auth.model';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_state';

  // Mock users database
  private mockUsers = new Map<string, { password: string; user: User }>([
    [
      'demo@pawmatch.com',
      {
        password: 'password123',
        user: {
          id: '1',
          email: 'demo@pawmatch.com',
          name: 'Demo User',
          createdAt: new Date()
        }
      }
    ]
  ]);

  private authState = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });

  // Public signals
  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor(
    private storage: StorageService,
    private router: Router
  ) {
    this.loadAuthState();
  }

  /**
   * Load authentication state from localStorage
   */
  private loadAuthState(): void {
    const stored = this.storage.getItem<AuthState>(this.AUTH_KEY);
    if (stored && stored.isAuthenticated) {
      // Check if session has expired (1 hour = 3600000 ms)
      if (stored.expiresAt && Date.now() > stored.expiresAt) {
        // Session expired, clear storage
        this.storage.removeItem(this.AUTH_KEY);
        this.authState.set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      } else {
        this.authState.set(stored);
      }
    }
  }

  /**
   * Save authentication state to localStorage with 1-hour expiration
   */
  private saveAuthState(state: AuthState): void {
    // Set expiration to 1 hour from now (3600000 ms)
    const stateWithExpiry = {
      ...state,
      expiresAt: Date.now() + 3600000 // 1 hour = 60 * 60 * 1000
    };
    this.storage.setItem(this.AUTH_KEY, stateWithExpiry);
    this.authState.set(stateWithExpiry);
  }

  /**
   * Sign in with email and password
   */
  signIn(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userRecord = this.mockUsers.get(credentials.email);

        if (!userRecord || userRecord.password !== credentials.password) {
          resolve({ success: false, error: 'Invalid email or password' });
          return;
        }

        const authState: AuthState = {
          user: userRecord.user,
          token: 'mock-jwt-token-' + Date.now(),
          isAuthenticated: true
        };

        this.saveAuthState(authState);
        resolve({ success: true });
      }, 500); // Simulate API delay
    });
  }

  /**
   * Sign in with Google OAuth
   */
  signInWithGoogle(googleData: {
    email: string;
    name: string;
    picture?: string;
    googleId: string;
  }): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const newUser: User = {
            id: googleData.googleId,
            email: googleData.email,
            name: googleData.name,
            profilePicture: googleData.picture,
            googleId: googleData.googleId,
            createdAt: new Date()
          };

          // Store in mock users
          this.mockUsers.set(googleData.email, {
            password: '', // No password for OAuth users
            user: newUser
          });

          const authState: AuthState = {
            user: newUser,
            token: 'mock-jwt-token-google-' + Date.now(),
            isAuthenticated: true
          };

          this.saveAuthState(authState);
          resolve({ success: true });
        } catch (error) {
          resolve({ success: false, error: 'Google Sign-In failed' });
        }
      }, 500);
    });
  }

  /**
   * Sign up a new user
   */
  signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.mockUsers.has(email)) {
          resolve({ success: false, error: 'Email already registered' });
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          createdAt: new Date()
        };

        this.mockUsers.set(email, { password, user: newUser });

        const authState: AuthState = {
          user: newUser,
          token: 'mock-jwt-token-' + Date.now(),
          isAuthenticated: true
        };

        this.saveAuthState(authState);
        resolve({ success: true });
      }, 500);
    });
  }

  /**
   * Sign out the current user
   */
  signOut(): void {
    this.storage.removeItem(this.AUTH_KEY);
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    this.router.navigate(['/sign-in']);
  }

  /**
   * Check if user is authenticated and session is valid (for guards)
   */
  checkAuth(): boolean {
    const state = this.authState();
    if (!state.isAuthenticated) {
      return false;
    }

    // Check if session has expired
    if (state.expiresAt && Date.now() > state.expiresAt) {
      // Session expired, sign out
      this.signOut();
      return false;
    }

    return true;
  }
}
