import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Aggregated inventory snapshot for the dashboard cards.
// total_stock_value is intentionally a string because the backend returns it
// as pre-formatted currency (e.g. "1,250.00") rather than a raw number.
export interface DashboardSummary {
  total_products: number;
  total_stock_value: string;
  low_stock_count: number;
  out_of_stock_count: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService extends ApiService {
  private readonly endpoint = '/api/v1/products/summary/';

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.buildUrl(this.endpoint));
  }
}
