import { Component, OnInit } from '@angular/core';

import { Category, CategoryService } from './services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

constructor(
  private categoryService: CategoryService
) {}

ngOnInit(): void {
this.getCategories();
}

//Get all categories
getCategories(): void {

this.categoryService.getCategories().subscribe({
  next: (categories) => {
    this.categories = categories;
  },

  error: (error) => {
    console.error('Error loading categories:', error);
  }
});

}

}