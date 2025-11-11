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
      this.authState.set(stored);
    }
  }

  /**
   * Save authentication state to localStorage
   */
  private saveAuthState(state: AuthState): void {
    this.storage.setItem(this.AUTH_KEY, state);
    this.authState.set(state);
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
   * Check if user is authenticated (for guards)
   */
  checkAuth(): boolean {
    return this.authState().isAuthenticated;
  }
}
