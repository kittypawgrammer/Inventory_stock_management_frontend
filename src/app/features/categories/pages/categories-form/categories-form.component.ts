import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

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
      products: [0, [Validators.required, Validators.min(0)]],
      status: ['Active', Validators.required],
      displayOrder: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId = id ? Number(id) : null;
    this.isEditMode = !!this.categoryId;

    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe((category) => {
        if (category) {
          this.categoryForm.patchValue({
            name: category.name,
            description: category.description,
            products: category.products,
            status: category.status,
            displayOrder: category.displayOrder
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.categoryForm.value;
    const payload = {
      name: formValue.name,
      description: formValue.description,
      products: Number(formValue.products),
      status: formValue.status,
      displayOrder: Number(formValue.displayOrder)
    };

    if (this.isEditMode && this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, payload).subscribe(() => {
        this.router.navigate(['/categories']);
      });
      return;
    }

    this.categoryService.addCategory(payload).subscribe(() => {
      this.router.navigate(['/categories']);
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
