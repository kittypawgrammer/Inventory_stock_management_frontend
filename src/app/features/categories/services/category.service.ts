import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//handle asyn response from the api
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt?: string | null;
}

interface CategoryApi {
  id: number;
  name: string;
  description: string;
  created_at?: string | null;
}

function mapCategory(api: CategoryApi): Category {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    createdAt: api.created_at
  };
}

//tells Angular to create and manage one service instance , can be use throughout the app
@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/categories/`;

  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoryApi[]>(this.apiUrl).pipe(map((items) => items.map(mapCategory)));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<CategoryApi>(`${this.apiUrl}${id}`).pipe(map(mapCategory));
  }

  addCategory(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category> {
    return this.http
      .post<CategoryApi>(this.apiUrl, {
        name: category.name,
        description: category.description
      })
      .pipe(map(mapCategory));
  }

  updateCategory(id: number, category: Partial<Omit<Category, 'id' | 'createdAt'>>): Observable<Category> {
    const payload: Record<string, string> = {};
    if (category.name !== undefined) payload['name'] = category.name;
    if (category.description !== undefined) payload['description'] = category.description;

    return this.http.put<CategoryApi>(`${this.apiUrl}${id}`, payload).pipe(map(mapCategory));
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}