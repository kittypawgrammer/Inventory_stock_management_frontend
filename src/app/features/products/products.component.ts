import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product, ProductService } from './services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];

  private productSubscription?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }

  getProducts(): void {
    this.productSubscription = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  countByStatus(status: Product['status']): number {
    return this.products.filter((product) => product.status === status).length;
  }
}
