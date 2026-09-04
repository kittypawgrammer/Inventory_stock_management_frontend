import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService, Product } from '../../../../core/services/product.service';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { SupplierService, Supplier } from '../../../../core/services/supplier.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.css'
})
export class ProductsFormComponent implements OnInit {

  productForm!: FormGroup;

  // Load categories and suppliers for the dropdowns
  categories: Category[] = [];
  suppliers: Supplier[] = [];

  submitting = false;
  errorMessage = '';

  editMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService
  ) {

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      category_id: [null, Validators.required],
      supplier_id: [null, Validators.required],
      unit_price: [null, [Validators.required,Validators.min(0)]],
      quantity_in_stock: [null, [Validators.required,Validators.min(0)]],
      reorder_level: [null, [Validators.required,Validators.min(0)]]
    });

  }

  ngOnInit(): void {

    // Load categories for the dropdowns

    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });

    // Load suppliers for the dropdowns
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliers = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });

    // Check if editing an existing product
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editMode = true;
      this.productId = +idParam;

      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue({
            name: product.name,
            sku: product.sku,
            category_id: product.category_id,
            supplier_id: product.supplier_id,
            unit_price: product.unit_price,
            quantity_in_stock: product.quantity_in_stock,
            reorder_level: product.reorder_level
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.errorMessage = 'Could not load product.';
        }
      });
    }

  }

  onSubmit(): void {

    // Validate the form before submission

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const product: Omit<Product, 'id' | 'status'> =
      this.productForm.value;

    if (this.editMode && this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.submitting = false;
          this.errorMessage = 'Could not update product.';
        }
      });
    } else {
      // Add new product
      this.productService.addProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.submitting = false;
          this.errorMessage = 'Could not add product.';
        }
      });
    }

  }

  //cancel and navigate back to the products list
  cancel(): void {
    this.router.navigate(['/products']);
  }

}
