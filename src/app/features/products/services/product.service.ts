import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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


   private normalizeProduct(item: any): Product {
    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      category_id: item.category_id,
      supplier_id: item.supplier_id,
      unit_price: Number(item.unit_price),
      quantity_in_stock: item.quantity_in_stock,
      reorder_level: item.reorder_level,
      is_active: item.is_active,
      createdAt: item.created_at ?? item.createdAt ?? null,
      updatedAt: item.updated_at ?? item.updatedAt ?? null,
      stock_status: this.normalizeStatus(item.stock_status)
    };
  }

  private normalizeStatus(value: string): Product['stock_status'] {
    const lower = String(value).toLowerCase();
    if (lower === 'low stock') return 'Low Stock';
    if (lower === 'out of stock') return 'Out of Stock';
    return 'In Stock';
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return this.http.get<{ items: any[] }>(this.apiUrl).pipe(
      map((res) => res.items.map((item) => this.normalizeProduct(item)))
    );
  }

  // Get a product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}${id}`).pipe(
      map((item) => this.normalizeProduct(item))
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
      `${this.apiUrl}/${id}`
    );
  }
}
