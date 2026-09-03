import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService, Product } from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  private productSubscription?: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
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

  countByStatus(status: Product['stock_status']): number {
    return this.products.filter((product) => product.stock_status === status).length;
  }
}
