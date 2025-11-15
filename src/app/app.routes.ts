import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';

// Auto-redirect guard: if logged in, go to match page
const autoRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkAuth()) {
    router.navigate(['/match']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in').then(m => m.SignIn),
    canActivate: [autoRedirectGuard]
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome').then(m => m.Welcome),
    canActivate: [autoRedirectGuard]
  },
  {
    path: 'register-dog',
    loadComponent: () => import('./pages/register-dog/register-dog').then(m => m.RegisterDog),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-home/profile-home').then(m => m.ProfileHome),
    canActivate: [authGuard]
  },
  {
    path: 'match-preferences',
    loadComponent: () => import('./pages/match-preferences/match-preferences').then(m => m.MatchPreferences),
    canActivate: [authGuard]
  },
  {
    path: 'match',
    loadComponent: () => import('./pages/match-swipe/match-swipe').then(m => m.MatchSwipe),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/welcome'
  }
];
