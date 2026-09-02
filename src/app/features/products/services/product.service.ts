import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Product {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  supplierId: number;
  price: number;
  quantity: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
}

interface ApiProduct {
  id: number;
  name: string;
  sku: string;
  category_id: number | string | { id: number; name: string };
  supplier_id: number | string | { id: number; name: string };
  unit_price: string | number;
  quantity_in_stock: number;
  reorder_level: number;
  stock_status?: string;
  description?: string;
}

type ProductResponse = ApiProduct | ApiProduct[] | { items: ApiProduct[] };

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/products/`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductResponse>(this.apiUrl)
      .pipe(map((response) => this.extractItems(response).map((item) => this.mapToProduct(item))));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<ProductResponse>(`${this.apiUrl}${id}/`).pipe(
      map((response) => {
        const item = this.extractItems(response)[0];
        return item ? this.mapToProduct(item) : undefined;
      })
    );
  }

  addProduct(product: Omit<Product, 'id' | 'status'> & { status?: Product['status'] }): Observable<Product> {
    const body = {
      name: product.name,
      sku: product.sku,
      category_id: product.categoryId,
      supplier_id: product.supplierId,
      unit_price: product.price,
      quantity_in_stock: product.quantity,
      reorder_level: product.reorderLevel,
      description: product.description
    };

    return this.http.post<ProductResponse>(this.apiUrl, body).pipe(map((item) => this.mapToProduct(this.extractItems(item)[0])));
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const body: Record<string, unknown> = {
      name: product.name,
      sku: product.sku,
      category_id: product.categoryId,
      supplier_id: product.supplierId,
      unit_price: product.price,
      quantity_in_stock: product.quantity,
      reorder_level: product.reorderLevel,
      description: product.description
    };

    return this.http.put<ProductResponse>(`${this.apiUrl}${id}/`, body).pipe(map((item) => this.mapToProduct(this.extractItems(item)[0])));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  private mapToProduct(item: ApiProduct): Product {
    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      categoryId: this.extractId(item.category_id),
      supplierId: this.extractId(item.supplier_id),
      price: Number(item.unit_price),
      quantity: item.quantity_in_stock,
      reorderLevel: item.reorder_level,
      status: this.mapStockStatus(item.stock_status ?? this.calculateStatus(item.quantity_in_stock, item.reorder_level)),
      description: item.description ?? ''
    };
  }

  private extractItems(response: ProductResponse): ApiProduct[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (response && Array.isArray((response as { items?: unknown }).items)) {
      return (response as { items: ApiProduct[] }).items;
    }
    return response ? [response as ApiProduct] : [];
  }

  private extractId(value: number | string | { id: number; name: string }): number {
    if (typeof value === 'object') {
      return value.id;
    }
    return Number(value);
  }

  private mapStockStatus(status: string): Product['status'] {
    const normalized = status.toLowerCase().trim();
    if (normalized === 'out of stock') {
      return 'Out of Stock';
    }
    if (normalized === 'low stock') {
      return 'Low Stock';
    }
    return 'In Stock';
  }

  private calculateStatus(quantity: number, reorderLevel: number): Product['status'] {
    if (quantity === 0) {
      return 'Out of Stock';
    }
    if (quantity <= reorderLevel) {
      return 'Low Stock';
    }
    return 'In Stock';
  }
}