import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Supplier, SupplierService } from '../../services/supplier.service';

export interface Suggestion {
  name: string;
  sub: string;
}

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent implements OnInit, OnDestroy {
  @Input() suppliers: Supplier[] = [];

  searchQuery = '';
  showSuggestions = false;
  selectedSuggestionIndex = -1;

  private routeSubscription?: Subscription;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('search') ?? '';
    });

    if (!this.suppliers.length) {
      this.supplierService.getSuppliers().subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
        },
        error: (error) => {
          console.error('Error loading suppliers:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  get filteredSuppliers(): Supplier[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.suppliers;
    }
    return this.suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(query) ||
        supplier.contactEmail.toLowerCase().includes(query) ||
        supplier.phone.toLowerCase().includes(query) ||
        supplier.address.toLowerCase().includes(query)
    );
  }

  get suggestions(): Suggestion[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }

    return this.suppliers
      .filter((s) => s.name.toLowerCase().includes(query) || s.contactEmail.toLowerCase().includes(query))
      .slice(0, 8)
      .map((s) => ({ name: s.name, sub: s.contactEmail }));
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.showSuggestions = true;
    this.selectedSuggestionIndex = -1;
  }

  selectSuggestion(suggestion: Suggestion): void {
    this.searchQuery = suggestion.name;
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
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

  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.suppliers = this.suppliers.filter((supplier) => supplier.id !== id);
      },
      error: (error) => {
        console.error('Error deleting supplier:', error);
      }
    });
  }
}