import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.css'
})
export class ProductsFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required]],
      category: ['', Validators.required],
      supplier: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      reorderLevel: [null, [Validators.required, Validators.min(0)]],
      status: ['In Stock', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.productId = productId ? Number(productId) : null;
    this.isEditMode = !!this.productId;

    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe((product) => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            sku: product.sku,
            category: product.category,
            supplier: product.supplier,
            price: product.price,
            quantity: product.quantity,
            reorderLevel: product.reorderLevel,
            status: product.status,
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
      category: formValue.category,
      supplier: formValue.supplier,
      price: Number(formValue.price),
      quantity: Number(formValue.quantity),
      reorderLevel: Number(formValue.reorderLevel),
      status: formValue.status,
      description: formValue.description
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, payload).subscribe(() => {
        this.router.navigate(['/products']);
      });
      return;
    }

    this.productService.addProduct(payload).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
