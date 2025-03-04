/* import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth/register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'auth/login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
];
 */
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { BibliothequeComponent } from './components/bibliotheque/bibliotheque.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Chemin explicite pour home
  { path: 'bibliotheque', component: BibliothequeComponent, canActivate: [AuthGuard] }, // Protégez avec AuthGuard si nécessaire
  { path: 'apropos', redirectTo: '/home', pathMatch: 'full' }, // Redirige vers home en attendant la création du composant
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirige la racine vers home
  { path: '**', redirectTo: '/auth/login' }, // Redirige les routes inconnues vers login
];