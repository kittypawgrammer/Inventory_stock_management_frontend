import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category_id: number;
  supplier_id: number;
  unit_price: number;
  quantity_in_stock: number;
  reorder_level: number;
  is_active: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;  
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl =
    `${environment.apiUrl}/api/v1/products/`;

  constructor(private http: HttpClient) { }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Get a product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}${id}`
    );
  }

  // Add a new product
  addProduct(product: Omit<Product, 'id' | 'status'>): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      product
    );
  }

  //delete a product by ID
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}${id}`
    );
  }
}
