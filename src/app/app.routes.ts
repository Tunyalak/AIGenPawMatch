import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in/sign-in').then(m => m.SignIn)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome').then(m => m.Welcome)
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
