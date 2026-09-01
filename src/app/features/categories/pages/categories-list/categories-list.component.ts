import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  countByStatus(status: Category['status']): number {
    return this.categories.filter((category) => category.status === status).length;
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe();
  }
}
