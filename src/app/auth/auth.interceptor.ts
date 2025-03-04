// src/app/auth/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Utiliser inject() pour accéder au service d'authentification
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Afficher le token pour le débogage
  console.log('Interceptor token:', token);
  
  if (token) {
    // Cloner la requête et ajouter l'en-tête d'autorisation
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Adding auth header to request:', req.url);
    return next(authReq);
  }
  
  // Si pas de token, passer la requête originale
  return next(req);
};