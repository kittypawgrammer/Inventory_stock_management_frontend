import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product, ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { SupplierService } from '../../../suppliers/services/supplier.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  selectedStatus = 'All Status';
  searchQuery = '';
  showSuggestions = false;
  selectedSuggestionIndex = -1;

  private categoryNames = new Map<number, string>();
  private supplierNames = new Map<number, string>();
  private routeSubscription?: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('search') ?? '';
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  loadData(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categoryNames = new Map(categories.map((c) => [c.id, c.name]));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.supplierNames = new Map(suppliers.map((s) => [s.id, s.name]));
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      }
    });
  }

  get filteredProducts(): Product[] {
    let result = this.products;
    if (this.selectedStatus !== 'All Status') {
      result = result.filter((product) => product.status === this.selectedStatus);
    }
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          this.getCategoryName(product).toLowerCase().includes(query) ||
          this.getSupplierName(product).toLowerCase().includes(query)
      );
    }
    return result;
  }

  get suggestions(): Product[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }
    const matches = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        this.getCategoryName(product).toLowerCase().includes(query) ||
        this.getSupplierName(product).toLowerCase().includes(query)
    );
    return this.dedupe(matches).slice(0, 8);
  }

  getCategoryName(product: Product): string {
    return this.categoryNames.get(product.categoryId) ?? `#${product.categoryId}`;
  }

  getSupplierName(product: Product): string {
    return this.supplierNames.get(product.supplierId) ?? `#${product.supplierId}`;
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.showSuggestions = true;
    this.selectedSuggestionIndex = -1;
  }

  selectSuggestion(product: Product): void {
    this.searchQuery = product.name;
    this.showSuggestions = false;
  }

  onSearchKeydown(event: KeyboardEvent): void {
    const list = this.suggestions;
    if (list.length === 0) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedSuggestionIndex = (this.selectedSuggestionIndex + 1) % list.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedSuggestionIndex = this.selectedSuggestionIndex <= 0 ? list.length - 1 : this.selectedSuggestionIndex - 1;
    } else if (event.key === 'Enter' && this.selectedSuggestionIndex >= 0) {
      event.preventDefault();
      this.selectSuggestion(list[this.selectedSuggestionIndex]);
    } else if (event.key === 'Escape') {
      this.showSuggestions = false;
    }
  }

  onBlurSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
      this.selectedSuggestionIndex = -1;
    }, 150);
  }

  private dedupe(items: Product[]): Product[] {
    const seen = new Set<string>();
    return items.filter((product) => {
      const key = product.name.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  countByStatus(status: Product['status']): number {
    return this.products.filter((product) => product.status === status).length;
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter((product) => product.id !== id);
    });
  }
}