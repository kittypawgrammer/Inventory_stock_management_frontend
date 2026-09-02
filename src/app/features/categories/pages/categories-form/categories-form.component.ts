import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.css'
})
export class CategoriesFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId = id ? Number(id) : null;
    this.isEditMode = !!this.categoryId;

    if (this.categoryId) {
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          const category = categories.find((c) => c.id === this.categoryId);
          if (category) {
            this.categoryForm.patchValue({
              name: category.name,
              description: category.description,
            });
          }
        },
        error: (error) => {
          console.error('Error loading category:', error);
        }
      });
    }
  }

  private buildPayload(): Omit<Category, 'id'> {
    const formValue = this.categoryForm.value;

    return {
      name: formValue.name,
      description: formValue.description,
    };
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    const request$ = this.isEditMode && this.categoryId
      ? this.categoryService.updateCategory(this.categoryId, payload)
      : this.categoryService.addCategory(payload);

    request$.subscribe({
      next: () => {
        this.categoryForm.reset({
          name: '',
          description: '',
        });
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Error saving category:', error);
      }
    });
  }

  cancel(): void {
    this.categoryForm.reset({
      name: '',
      description: '',
    });
    this.router.navigate(['/categories']);
  }
}
