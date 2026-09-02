import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export interface Supplier {
  id: number;
  name: string;
  contactEmail: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface SupplierApi {
  id: number;
  name: string;
  contact_email: string;
  phone: string;
  address: string;
  created_at: string;
}

function mapSupplier(api: SupplierApi): Supplier {
  return {
    id: api.id,
    name: api.name,
    contactEmail: api.contact_email,
    phone: api.phone,
    address: api.address,
    createdAt: api.created_at
  };
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/suppliers`;

  constructor(private readonly http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<SupplierApi[]>(this.apiUrl).pipe(map((items) => items.map(mapSupplier)));
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<SupplierApi>(`${this.apiUrl}/${id}`).pipe(map(mapSupplier));
  }

  addSupplier(supplier: Omit<Supplier, 'id' | 'createdAt'>): Observable<Supplier> {
    return this.http
      .post<SupplierApi>(this.apiUrl, {
        name: supplier.name,
        contact_email: supplier.contactEmail,
        phone: supplier.phone,
        address: supplier.address
      })
      .pipe(map(mapSupplier));
  }

  updateSupplier(id: number, supplier: Partial<Omit<Supplier, 'id' | 'createdAt'>>): Observable<Supplier> {
    const payload: Record<string, string> = {};
    if (supplier.name !== undefined) payload['name'] = supplier.name;
    if (supplier.contactEmail !== undefined) payload['contact_email'] = supplier.contactEmail;
    if (supplier.phone !== undefined) payload['phone'] = supplier.phone;
    if (supplier.address !== undefined) payload['address'] = supplier.address;

    return this.http.put<SupplierApi>(`${this.apiUrl}/${id}`, payload).pipe(map(mapSupplier));
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}