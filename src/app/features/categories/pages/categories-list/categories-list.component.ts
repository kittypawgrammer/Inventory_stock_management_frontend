import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];

  searchQuery = '';
  showSuggestions = false;
  selectedSuggestionIndex = -1;

  private routeSubscription?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('search') ?? '';
    });

    if (!this.categories.length) {
      this.categoryService.getCategories().subscribe((categories) => {
        this.categories = categories;
      });
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  get filteredCategories(): Category[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.categories;
    }
    return this.categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        (category.description ? category.description.toLowerCase().includes(query) : false)
    );
  }

  get suggestions(): Category[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }
    const matches = this.categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        (category.description ? category.description.toLowerCase().includes(query) : false)
    );
    return this.dedupe(matches).slice(0, 8);
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.showSuggestions = true;
    this.selectedSuggestionIndex = -1;
  }

  selectSuggestion(category: Category): void {
    this.searchQuery = category.name;
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

  private dedupe(items: Category[]): Category[] {
    const seen = new Set<string>();
    return items.filter((category) => {
      const key = category.name.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  deleteCategory(id: number): void {
    const category = this.categories.find((item) => item.id === id);

    if (!category) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter((item) => item.id !== id);
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }
}