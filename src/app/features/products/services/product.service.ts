import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  price: number;
  quantity: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([
    {
      id: 1,
      name: 'Wireless Headphones',
      sku: 'WH-2048',
      category: 'Electronics',
      supplier: 'Northwind Supply',
      price: 129.99,
      quantity: 45,
      reorderLevel: 15,
      status: 'In Stock',
      description: 'Noise-cancelling wireless headset designed for long office calls and focus-heavy work sessions.'
    },
    {
      id: 2,
      name: 'Office Chair',
      sku: 'OC-118',
      category: 'Office Supplies',
      supplier: 'Prime Retail Co.',
      price: 249,
      quantity: 12,
      reorderLevel: 18,
      status: 'Low Stock',
      description: 'Ergonomic office chair with adjustable arms and breathable mesh back.'
    },
    {
      id: 3,
      name: 'Kitchen Organizer',
      sku: 'KO-320',
      category: 'Home Goods',
      supplier: 'Urban Market',
      price: 39.5,
      quantity: 0,
      reorderLevel: 10,
      status: 'Out of Stock',
      description: 'Compact kitchen storage system for organizing pantry and countertop essentials.'
    }
  ]);

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.productsSubject.value.find((product) => product.id === id));
  }

  addProduct(product: Omit<Product, 'id' | 'status'> & { status?: Product['status'] }): Observable<Product> {
    const nextProduct: Product = {
      ...product,
      id: this.getNextId(),
      status: this.calculateStatus(product.quantity, product.reorderLevel)
    } as Product;

    this.productsSubject.next([...this.productsSubject.value, nextProduct]);
    return of(nextProduct);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const currentProducts = [...this.productsSubject.value];
    const index = currentProducts.findIndex((item) => item.id === id);

    if (index === -1) {
      return of(product as Product);
    }

    const updatedProduct: Product = {
      ...currentProducts[index],
      ...product,
      status: this.calculateStatus(product.quantity ?? currentProducts[index].quantity, product.reorderLevel ?? currentProducts[index].reorderLevel)
    };

    currentProducts[index] = updatedProduct;
    this.productsSubject.next(currentProducts);
    return of(updatedProduct);
  }

  deleteProduct(id: number): Observable<Product[]> {
    const filteredProducts = this.productsSubject.value.filter((product) => product.id !== id);
    this.productsSubject.next(filteredProducts);
    return of(filteredProducts);
  }

  private getNextId(): number {
    return this.productsSubject.value.length + 1;
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
