import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../services/product.service';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { SupplierService } from '../../../suppliers/services/supplier.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit {

  // Products received from parent component
  @Input() products: Product[] = [];

  // Search and filter values
  selectedStatus = 'All Status';
  searchQuery = '';
  showSuggestions = false;
  selectedSuggestionIndex = -1;

  // Store category and supplier names using their IDs
  private categoryNames = new Map<number, string>();
  private supplierNames = new Map<number, string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // Get search value from URL
    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('search') || '';
    });

    // Get categories
    this.categoryService.getCategories().subscribe({
      next: (categories) => {

        categories.forEach((category) => {
          this.categoryNames.set(category.id, category.name);
        });

      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Get suppliers
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {

        suppliers.forEach((supplier) => {
          this.supplierNames.set(supplier.id, supplier.name);
        });

      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }


  // Filter products based on status and search
  get filteredProducts(): Product[] {

    let result = this.products;

    // Filter by status
    if (this.selectedStatus !== 'All Status') {

      result = result.filter((product) => {
        return product.stock_status === this.selectedStatus;
      });

    }

    // Convert search text to lowercase
    const query = this.searchQuery.trim().toLowerCase();

    // Filter by search
    if (query) {

      result = result.filter((product) => {

        return (
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          this.getCategoryName(product).toLowerCase().includes(query) ||
          this.getSupplierName(product).toLowerCase().includes(query)
        );

      });

    }

    return result;
  }


  // Get search suggestions
  get suggestions(): Product[] {

    const query = this.searchQuery.trim().toLowerCase();

    // If search is empty, show no suggestions
    if (!query) {
      return [];
    }

    const matches = this.products.filter((product) => {

      return (
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        this.getCategoryName(product).toLowerCase().includes(query) ||
        this.getSupplierName(product).toLowerCase().includes(query)
      );

    });

    return matches;
  }

  // Get category name using category ID
  getCategoryName(product: Product): string {

    const categoryName = this.categoryNames.get(product.category_id);

    if (categoryName) {
      return categoryName;
    }

    return `#${product.category_id}`;
  }


  // Get supplier name using supplier ID
  getSupplierName(product: Product): string {

    const supplierName = this.supplierNames.get(product.supplier_id);

    if (supplierName) {
      return supplierName;
    }

    return `#${product.supplier_id}`;
  }


  // When user types in search box
  onSearchInput(query: string): void {

    this.searchQuery = query;

    this.showSuggestions = true;

    this.selectedSuggestionIndex = -1;
  }


  // When user selects a suggestion
  selectSuggestion(product: Product): void {

    this.searchQuery = product.name;

    this.showSuggestions = false;
  }


  // Handle keyboard events
  onSearchKeydown(event: KeyboardEvent): void {

    const list = this.suggestions;

    // Stop if there are no suggestions
    if (list.length === 0) {
      return;
    }

    // Arrow Down
    if (event.key === 'ArrowDown') {

      event.preventDefault();

      this.selectedSuggestionIndex =
        (this.selectedSuggestionIndex + 1) % list.length;
    }

    // Arrow Up
    else if (event.key === 'ArrowUp') {

      event.preventDefault();

      if (this.selectedSuggestionIndex <= 0) {
        this.selectedSuggestionIndex = list.length - 1;
      } else {
        this.selectedSuggestionIndex--;
      }
    }

    // Enter
    else if (
      event.key === 'Enter' &&
      this.selectedSuggestionIndex >= 0
    ) {

      event.preventDefault();

      this.selectSuggestion(
        list[this.selectedSuggestionIndex]
      );
    }

  }


  // Change status filter
  onStatusChange(status: string): void {

    this.selectedStatus = status;
  }


  // Delete product
  deleteProduct(id: number): void {

    this.productService.deleteProduct(id).subscribe({

      next: () => {

        // Remove deleted product from UI
        this.products = this.products.filter((product) => {
          return product.id !== id;
        });

      },

      error: (error) => {
        console.error('Error deleting product:', error);
      }

    });
  }
}