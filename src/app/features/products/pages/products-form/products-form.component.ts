import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { SupplierService } from '../../../suppliers/services/supplier.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.css'
})
export class ProductsFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categories: { id: number; name: string }[] = [];
  suppliers: { id: number; name: string }[] = [];
  submitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required]],
      categoryId: [null, Validators.required],
      supplierId: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      reorderLevel: [null, [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productId = productId ? Number(productId) : null;
    this.isEditMode = !!this.productId;

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories.map((category) => ({ id: category.id, name: category.name }));
    });

    this.supplierService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers.map((supplier) => ({ id: supplier.id, name: supplier.name }));
    });

    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe((product) => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            sku: product.sku,
            categoryId: product.categoryId,
            supplierId: product.supplierId,
            price: product.price,
            quantity: product.quantity,
            reorderLevel: product.reorderLevel,
            description: product.description
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;
    const payload = {
      name: formValue.name,
      sku: formValue.sku,
      categoryId: Number(formValue.categoryId),
      supplierId: Number(formValue.supplierId),
      price: Number(formValue.price),
      quantity: Number(formValue.quantity),
      reorderLevel: Number(formValue.reorderLevel),
      description: formValue.description
    };

    this.errorMessage = null;
    this.submitting = true;

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => this.handleSubmitError(err)
      });
      return;
    }

    this.productService.addProduct(payload).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => this.handleSubmitError(err)
    });
  }

  private handleSubmitError(err: unknown): void {
    this.submitting = false;
    const status = (err as { status?: number })?.status;

    if (status === 409) {
      this.errorMessage = 'A product with this SKU already exists. Please use a different SKU.';
      return;
    }
    this.errorMessage = 'Could not save the product. Please try again.';
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}