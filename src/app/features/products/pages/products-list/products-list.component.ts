import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  countByStatus(status: Product['status']): number {
    return this.products.filter((product) => product.status === status).length;
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe();
  }
}

