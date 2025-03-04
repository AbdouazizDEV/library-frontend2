// src/app/services/books.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Book {
  _id: string;
  title: string;
  author: string;
  publishedDate: string;
  category: string;
  rating: number;
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'http://localhost:4000/api/books';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBooks(page = 1, limit = 5): Observable<BooksResponse> {
    // Ajout de logs pour le débogage
    const token = this.authService.getToken();
    console.log('Token retrieved:', token);
    
    // L'intercepteur ajoutera automatiquement l'en-tête d'autorisation
    return this.http.get<BooksResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`).pipe(
      tap(response => console.log('Books fetched:', response))
    );
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  searchBooks(query: string): Observable<BooksResponse> {
    return this.http.get<BooksResponse>(`${this.apiUrl}/search?q=${query}`);
  }

  getTopRatedBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/top-rated`);
  }
}