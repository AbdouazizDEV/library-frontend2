// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth'; // URL de votre API NestJS

  constructor(private http: HttpClient, private router: Router) {}

  // Méthode pour l'enregistrement
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/auth/login']); // Rediriger vers la page de connexion après l'inscription
      })
    );
  }

  // Méthode pour la connexion
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.token); // Stocker le token JWT dans le localStorage
        this.router.navigate(['/']); // Rediriger vers la page d'accueil après la connexion
      })
    );
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}