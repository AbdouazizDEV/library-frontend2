/* import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth/register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'auth/login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
];
 */
// src/app/app.routes.ts
// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // Protéger la page d'accueil avec un guard
  { path: '**', redirectTo: '/auth/login' }, // Rediriger les routes inconnues vers la page de connexion
];