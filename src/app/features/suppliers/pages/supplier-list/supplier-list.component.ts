import { Component, OnInit } from '@angular/core';
import { Supplier, SupplierService } from '../../services/supplier.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.supplierService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
    });
  }

  countByStatus(status: Supplier['status']): number {
    return this.suppliers.filter((supplier) => supplier.status === status).length;
  }

  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id).subscribe();
  }
}
