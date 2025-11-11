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
  ) {}

  async signInWithGoogle() {
    // Mock Google sign-in - in real app would integrate with Google OAuth
    this.isLoading.set(true);
    this.errorMessage.set('');

    const result = await this.authService.signIn({
      email: 'demo@pawmatch.com',
      password: 'password123'
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
