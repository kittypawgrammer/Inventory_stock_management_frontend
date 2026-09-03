import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Supplier {
  id: number;
  name: string;
  contact_email: string;
  phone: string;
  address: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class SupplierService extends ApiService {
  private readonly endpoint = '/api/v1/suppliers/';

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.buildUrl(this.endpoint));
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(this.buildUrl(`${this.endpoint}${id}`));
  }

  addSupplier(supplier: Omit<Supplier, 'id' | 'created_at'>): Observable<Supplier> {
    return this.http.post<Supplier>(this.buildUrl(this.endpoint), supplier);
  }

  updateSupplier(id: number, supplier: Partial<Omit<Supplier, 'id' | 'created_at'>>): Observable<Supplier> {
    return this.http.put<Supplier>(this.buildUrl(`${this.endpoint}${id}`), supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(this.buildUrl(`${this.endpoint}${id}`));
  }
}
