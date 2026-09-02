import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-suplier-form',
  templateUrl: './suplier-form.component.html',
  styleUrl: './suplier-form.component.css'
})
export class SuplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isEditMode = false;
  supplierId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.supplierId = id ? Number(id) : null;
    this.isEditMode = !!this.supplierId;

    if (this.supplierId) {
      this.supplierService.getSuppliers().subscribe({
        next: (suppliers) => {
          const supplier = suppliers.find((s) => s.id === this.supplierId);
          if (supplier) {
            this.supplierForm.patchValue({
              name: supplier.name,
              contactEmail: supplier.contactEmail,
              phone: supplier.phone,
              address: supplier.address
            });
          }
        },
        error: (error) => {
          console.error('Error loading supplier:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    const formValue = this.supplierForm.value;
    const payload = {
      name: formValue.name,
      contactEmail: formValue.contactEmail,
      phone: formValue.phone,
      address: formValue.address
    };

    if (this.isEditMode && this.supplierId) {
      this.supplierService.updateSupplier(this.supplierId, payload).subscribe(() => {
        this.router.navigate(['/suppliers']);
      });
      return;
    }

    this.supplierService.addSupplier(payload).subscribe(() => {
      this.router.navigate(['/suppliers']);
    });
  }

  cancel(): void {
    this.router.navigate(['/suppliers']);
  }
}
