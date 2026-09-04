import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';


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
  created_at?: string | null;
  updated_at?: string | null;
  stock_status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}


export function normalizeProduct(item: any): Product {
  return {
    ...item,
    unit_price: Number(item.unit_price),
    stock_status: normalizeStatus(item.stock_status)
  };
}

function normalizeStatus(value: string): Product['stock_status'] {
  const lower = String(value).toLowerCase();
  if (lower === 'low stock') return 'Low Stock';
  if (lower === 'out of stock') return 'Out of Stock';
  return 'In Stock';
}

@Injectable({ providedIn: 'root' })
export class ProductService extends ApiService {
  private readonly endpoint = '/api/v1/products/';

  // Fetches all products. The list endpoint wraps the array in an { items: [] } object.
  getProducts(): Observable<Product[]> {
    return this.http.get<{ items: any[] }>(this.buildUrl(this.endpoint)).pipe(
      map((res) => res.items.map(normalizeProduct))
    );
  }

  // Single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(this.buildUrl(`${this.endpoint}${id}`)).pipe(
      map(normalizeProduct)
    );
  }

 //add prodct
  addProduct(product: Omit<Product, 'id' | 'stock_status'>): Observable<Product> {
    return this.http.post<Product>(this.buildUrl(this.endpoint), product);
  }

  //update product
  updateProduct(id: number, product: Omit<Product, 'id' | 'stock_status'>): Observable<Product> {
    return this.http.put<Product>(this.buildUrl(`${this.endpoint}${id}`), product);
  }

  //delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(this.buildUrl(`${this.endpoint}${id}`));
  }
}
