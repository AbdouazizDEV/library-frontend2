import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajustez le chemin

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NavComponent {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Méthode pour naviguer vers une route spécifique
  navigate(route: string): void {
    this.router.navigate([route]);
  }

  // Méthode pour se déconnecter
  logout(): void {
    // Appeler la méthode de déconnexion du service d'authentification
    this.authService.logout();
    // Rediriger vers la page de connexion
    this.router.navigate(['/auth/login']);
  }
}