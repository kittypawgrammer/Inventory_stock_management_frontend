import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CategoryService extends ApiService {
  private readonly endpoint = '/api/v1/categories/';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.buildUrl(this.endpoint));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(this.buildUrl(`${this.endpoint}${id}`));
  }

  addCategory(category: Omit<Category, 'id' | 'created_at'>): Observable<Category> {
    return this.http.post<Category>(this.buildUrl(this.endpoint), {
      name: category.name,
      description: category.description
    });
  }

  updateCategory(id: number, category: Partial<Omit<Category, 'id' | 'created_at'>>): Observable<Category> {
    const payload: Record<string, string> = {};
    if (category.name !== undefined) payload['name'] = category.name;
    if (category.description !== undefined) payload['description'] = category.description;
    return this.http.put<Category>(this.buildUrl(`${this.endpoint}${id}`), payload);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(this.buildUrl(`${this.endpoint}${id}`));
  }
}
