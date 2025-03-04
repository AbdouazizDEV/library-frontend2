// src/app/components/bibliotheque/bibliotheque.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BooksService, Book } from '../../services/books.service';

@Component({
  selector: 'app-bibliotheque',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './bibliotheque.component.html',
  styleUrls: ['bibliotheque.component.css']
})
export class BibliothequeComponent implements OnInit {
  books: Book[] = [];
  currentPage = 1;
  totalPages = 0;
  loading = false;
  searchTerm = '';
  categories: string[] = ['Fiction', 'Science-Fiction', 'Biographie', 'Histoire', 'Développement Personnel'];
  currentCategory = 'all';

  constructor(private booksService: BooksService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.booksService.getBooks(this.currentPage).subscribe({
      next: (response) => {
        console.log('Books response:', response);
        this.books = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;

        // Extrait les catégories uniques des livres (si votre API ne fournit pas déjà une liste)
        if (response.data.length > 0) {
          const uniqueCategories = [...new Set(response.data.map(book => book.category))];
          if (uniqueCategories.length > 0) {
            this.categories = uniqueCategories;
          }
        }
      },
      error: (error) => {
        console.error('Error fetching books:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number | string): void {
    // Ignorer si page est une chaîne (comme '...')
    if (typeof page !== 'number') return;
    
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadBooks();
    
    // Smooth scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  searchBooks(): void {
    if (this.searchTerm.trim() === '' && this.currentCategory === 'all') {
      this.loadBooks();
      return;
    }

    this.loading = true;
    this.booksService.searchBooks(this.searchTerm).subscribe({
      next: (response) => {
        this.books = response.data;
        
        // Si une catégorie est sélectionnée, filtrer les résultats
        if (this.currentCategory !== 'all') {
          this.books = this.books.filter(book => book.category === this.currentCategory);
        }
        
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching books:', error);
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.currentCategory = category;
    
    if (this.searchTerm.trim() === '' && category === 'all') {
      this.loadBooks();
      return;
    }
    
    this.loading = true;
    
    if (category === 'all') {
      // Si 'Tous' est sélectionné, utilise la recherche normale
      this.searchBooks();
    } else {
      // Sinon, filtre par catégorie
      this.booksService.getBooks(1, 20).subscribe({
        next: (response) => {
          let filteredBooks = response.data;
          
          // Appliquer le filtre de catégorie
          filteredBooks = filteredBooks.filter(book => book.category === category);
          
          // Appliquer la recherche si un terme est présent
          if (this.searchTerm.trim() !== '') {
            const term = this.searchTerm.toLowerCase();
            filteredBooks = filteredBooks.filter(book => 
              book.title.toLowerCase().includes(term) || 
              book.author.toLowerCase().includes(term)
            );
          }
          
          this.books = filteredBooks;
          this.totalPages = Math.ceil(filteredBooks.length / 5);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering books:', error);
          this.loading = false;
        }
      });
    }
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.currentCategory = 'all';
    this.loadBooks();
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }
  
  getPageArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
  
  getSmartPagination(): (number | string)[] {
    const visiblePages: (number | string)[] = [];
  
    // Toujours afficher la première page
    visiblePages.push(1);
  
    if (this.currentPage > 3) {
      visiblePages.push('...');
    }
  
    // Pages autour de la page actuelle
    for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
      visiblePages.push(i);
    }
  
    if (this.currentPage < this.totalPages - 2) {
      visiblePages.push('...');
    }
  
    // Toujours afficher la dernière page si elle existe
    if (this.totalPages > 1) {
      visiblePages.push(this.totalPages);
    }
  
    console.log('Visible pages:', visiblePages); // Ajouter un log pour vérifier les types
    return visiblePages;
  }
  
}