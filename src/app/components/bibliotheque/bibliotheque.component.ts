import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

interface Book {
  id?: number;
  title: string;
  author: string;
  publishedDate: string;
  category: string;
  rating?: number;
  reviews?: any[];
}
declare module 'bootstrap';
@Component({
  selector: 'app-bibliotheque',
  
  imports: [ FormsModule,CommonModule],
  providers: [DatePipe], // If you're using services, add them here
  templateUrl: './bibliotheque.component.html',
  styleUrls: ['./bibliotheque.component.css']
})
export class BibliothequeComponent implements OnInit {
  books: Book[] = [];
  categories: string[] = ['Action', 'Romance', 'Science-Fiction', 'Histoire', 'Jeunesse'];
  loading: boolean = true;
  searchTerm: string = '';
  currentCategory: string = 'all';
  currentPage: number = 1;
  totalPages: number = 1;

  // New Book Modal Properties
  newBook: Book = {
    title: '',
    author: '',
    publishedDate: '',
    category: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    // Adjust the URL to match your backend endpoint
    this.http.get<any>('http://localhost:4000/api/books').subscribe({
      next: (response) => {
        this.books = response.data || response;
        this.loading = false;
        this.totalPages = Math.ceil(this.books.length / 8); // Assuming 8 books per page
      },
      error: (error) => {
        console.error('Error loading books', error);
        this.loading = false;
      }
    });
  }

  openAddBookModal() {
    // Use Bootstrap's modal method to show the modal
    const modal = new bootstrap.Modal(document.getElementById('addBookModal')!);
    
    modal.show();
  }

  addBook() {
    // Validate the form
    if (!this.newBook.title || !this.newBook.author || !this.newBook.publishedDate || !this.newBook.category) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Send POST request to add a new book
    this.http.post('http://localhost:4000/api/books', this.newBook).subscribe({
      next: (response) => {
        // Add the new book to the list
        this.books.unshift(response as Book);
        
        // Reset the form
        this.newBook = {
          title: '',
          author: '',
          publishedDate: '',
          category: ''
        };

        // Close the modal
        const modalElement = document.getElementById('addBookModal') ?? document.body;
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();

        // Optional: Show success message
        alert('Livre ajouté avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du livre', error);
        alert('Erreur lors de l\'ajout du livre');
      }
    });
  }

  // Search functionality
  searchBooks() {
    if (!this.searchTerm.trim()) {
      this.loadBooks();
      return;
    }

    // Filter books based on search term
    this.books = this.books.filter(book => 
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Category filtering
  filterByCategory(category: string) {
    this.currentCategory = category;
    
    if (category === 'all') {
      this.loadBooks();
      return;
    }

    // Filter books by selected category
    this.books = this.books.filter(book => book.category === category);
  }

  // Pagination methods
  onPageChange(page: number | string) {
    if (typeof page === 'number' && page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageArray(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  getSmartPagination(): (number | string)[] {
    if (this.totalPages <= 7) {
      return this.getPageArray();
    }

    const currentPage = this.currentPage;
    const totalPages = this.totalPages;

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  // Helper method for star rating
  getStarArray(rating: number = 0): number[] {
    return Array(5).fill(0).map((_, index) => index < Math.round(rating) ? 1 : 0);
  }

  // Reset search
  resetSearch() {
    this.searchTerm = '';
    this.currentCategory = 'all';
    this.loadBooks();
  }
}