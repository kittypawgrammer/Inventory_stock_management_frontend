import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() deleteCategoryEvent = new EventEmitter<number>();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    if (!this.categories.length) {
      this.categoryService.getCategories().subscribe((categories) => {
        this.categories = categories;
      });
    }
  }

  countByStatus(status: Category['status']): number {
    return this.categories.filter((category) => category.status === status).length;
  }

  deleteCategory(id: number): void {
    this.deleteCategoryEvent.emit(id);

    if (!this.categories.length) {
      this.categoryService.deleteCategory(id).subscribe();
    }
  }
}
