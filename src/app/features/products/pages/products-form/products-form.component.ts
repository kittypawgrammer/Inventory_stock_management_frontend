import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Product, ProductService } from '../../services/product.service';
import {Category,CategoryService} from '../../../categories/services/category.service';
import {Supplier,SupplierService} from '../../../suppliers/services/supplier.service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
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

    // Call the service to add the product

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

  //cancel and navigate back to the products list
  cancel(): void {
    this.router.navigate(['/products']);
  }

}
