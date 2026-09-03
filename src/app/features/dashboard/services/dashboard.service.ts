
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

//dashboard summary interface 
export interface DashboardSummary {
total_products: number;
total_stock_value: string;
low_stock_count: number;
out_of_stock_count: number;
}

@Injectable({
providedIn: 'root'
})
export class DashboardService {

private readonly apiUrl =
`${environment.apiUrl}/api/v1/products/summary/`;

constructor(private http: HttpClient) {}

getSummary(): Observable<DashboardSummary> {
return this.http.get<DashboardSummary>(this.apiUrl);
}
}
