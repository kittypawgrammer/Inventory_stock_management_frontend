import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../../products/services/product.service';
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
  private products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      products: [0, [Validators.required, Validators.min(0)]],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId = id ? Number(id) : null;
    this.isEditMode = !!this.categoryId;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.syncProductCount();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });

    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category) => {
          if (category) {
            this.categoryForm.patchValue({
              name: category.name,
              description: category.description,
              status: category.status
            });
            this.syncProductCount();
          }
        },
        error: (error) => {
          console.error('Error loading category:', error);
        }
      });
    }

    this.categoryForm.get('name')?.valueChanges.subscribe(() => {
      this.syncProductCount();
    });
  }

  private syncProductCount(): void {
    const categoryName = (this.categoryForm.get('name')?.value ?? '').trim();
    const count = this.products.filter(
      (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    ).length;

    this.categoryForm.patchValue({ products: count }, { emitEvent: false });
  }

  private buildPayload(): Omit<Category, 'id'> {
    const formValue = this.categoryForm.value;

    return {
      name: formValue.name,
      description: formValue.description,
      products: Number(formValue.products),
      status: formValue.status
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
          products: 0,
          status: 'Active'
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
      products: 0,
      status: 'Active'
    });
    this.router.navigate(['/categories']);
  }
}
