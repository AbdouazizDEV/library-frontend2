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
  private apiUrl = 'http://localhost:4000/api/auth';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/auth/login']);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Login successful', response);
        
        // S'assurer que nous stockons le bon token
        if (response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          console.log('Token stored:', response.access_token);
        } else if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          console.log('Token stored:', response.token);
        } else {
          console.error('No token found in the response', response);
        }
        
        this.router.navigate(['/']);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth/login']);
  }
  
  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Getting token from localStorage:', token);
    return token;
  }
}