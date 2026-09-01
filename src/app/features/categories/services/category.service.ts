import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//handle asyn response from the api
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Category {
  id: number;
  name: string;
  description: string;
  products: number;
  status: 'Active' | 'Low Use' | 'Inactive';
  displayOrder: number;
}

//tells Angular to create and manage one service instance , can be use throughout the app
@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/categories`;

  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}