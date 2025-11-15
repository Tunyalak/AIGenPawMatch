import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-sign-in',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  email = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  hidePassword = signal(true);

  constructor(
    private authService: AuthService,
    private router: Router,
    private storage: StorageService
  ) {
    // Check if returning from Microsoft OAuth
    this.checkMicrosoftCallback();
  }

  private checkMicrosoftCallback() {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      this.signInWithMicrosoft();
    }
  }

  async signInWithGoogle() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Initialize Google Sign-In
      const google = (window as any).google;

      if (!google || !google.accounts) {
        throw new Error('Google Sign-In not loaded. Please refresh the page.');
      }

      // Create a promise to handle the OAuth callback
      const googleUser = await new Promise<any>((resolve, reject) => {
        google.accounts.oauth2.initTokenClient({
          client_id: '355407485664-eshfvuiip1ovb1hl7j8ns7i64jnhd0ri.apps.googleusercontent.com',
          scope: 'email profile',
          callback: (response: any) => {
            if (response.error) {
              reject(response.error);
            } else {
              resolve(response);
            }
          },
        }).requestAccessToken();
      });

      // Get user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${googleUser.access_token}`
        }
      });

      const userInfo = await userInfoResponse.json();

      // Sign in with the Google user info
      const authResult = await this.authService.signInWithGoogle({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        googleId: userInfo.sub
      });

      this.isLoading.set(false);

      if (authResult.success) {
        // Check if user has already registered a dog
        const myDog = this.storage.getItem('myDog');
        if (myDog) {
          this.router.navigate(['/match']);
        } else {
          this.router.navigate(['/register-dog']);
        }
      } else {
        this.errorMessage.set(authResult.error || 'Sign in failed');
      }
    } catch (error: any) {
      this.isLoading.set(false);
      console.error('Google Sign-In error:', error);
      this.errorMessage.set(error.message || 'Google Sign-In failed');
    }
  }

  async signInWithMicrosoft() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Check if we're returning from Microsoft OAuth
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        // Parse tokens from URL
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');

        if (accessToken && idToken) {
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);

          // Get user info from Microsoft Graph API
          const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          const userInfo = await userInfoResponse.json();

          // Sign in with the Microsoft user info
          const authResult = await this.authService.signInWithGoogle({
            email: userInfo.mail || userInfo.userPrincipalName,
            name: userInfo.displayName,
            picture: undefined,
            googleId: userInfo.id
          });

          this.isLoading.set(false);

          if (authResult.success) {
            // Check if user has already registered a dog
            const myDog = this.storage.getItem('myDog');
            if (myDog) {
              this.router.navigate(['/match']);
            } else {
              this.router.navigate(['/register-dog']);
            }
          } else {
            this.errorMessage.set(authResult.error || 'Sign in failed');
          }
          return;
        }
      }

      // Microsoft Azure AD Configuration
      const msalConfig = {
        auth: {
          clientId: '9f31697a-b36a-4e2c-85b5-607d9c4283f4',
          authority: 'https://login.microsoftonline.com/b210c743-80a7-4519-985b-d870f711a83e',
          redirectUri: window.location.origin + '/sign-in'
        }
      };

      // Create Microsoft Sign-In URL
      const authUrl = new URL('https://login.microsoftonline.com/b210c743-80a7-4519-985b-d870f711a83e/oauth2/v2.0/authorize');
      authUrl.searchParams.append('client_id', msalConfig.auth.clientId);
      authUrl.searchParams.append('response_type', 'token id_token');
      authUrl.searchParams.append('redirect_uri', msalConfig.auth.redirectUri);
      authUrl.searchParams.append('scope', 'openid profile email User.Read');
      authUrl.searchParams.append('response_mode', 'fragment');
      authUrl.searchParams.append('state', Math.random().toString(36).substring(7));
      authUrl.searchParams.append('nonce', Math.random().toString(36).substring(7));

      // Redirect to Microsoft Sign-In
      window.location.href = authUrl.toString();

    } catch (error: any) {
      this.isLoading.set(false);
      console.error('Microsoft Sign-In error:', error);
      this.errorMessage.set(error.message || 'Microsoft Sign-In failed');
    }
  }

  async signInWithEmail() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Please enter email and password');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const result = await this.authService.signIn({
      email: this.email(),
      password: this.password()
    });

    this.isLoading.set(false);

    if (result.success) {
      // Check if user has already registered a dog
      const myDog = this.storage.getItem('myDog');
      if (myDog) {
        this.router.navigate(['/match']);
      } else {
        this.router.navigate(['/register-dog']);
      }
    } else {
      this.errorMessage.set(result.error || 'Sign in failed');
    }
  }

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
