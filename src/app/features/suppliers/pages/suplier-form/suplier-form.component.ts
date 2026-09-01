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
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.supplierId = id ? Number(id) : null;
    this.isEditMode = !!this.supplierId;

    if (this.supplierId) {
      this.supplierService.getSupplierById(this.supplierId).subscribe((supplier) => {
        if (supplier) {
          this.supplierForm.patchValue({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            contact: supplier.contact,
            address: supplier.address,
            status: supplier.status
          });
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
      email: formValue.email,
      phone: formValue.phone,
      contact: formValue.contact,
      address: formValue.address,
      status: formValue.status
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
