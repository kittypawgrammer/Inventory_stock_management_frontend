import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';


import { environment } from '../../../environments/environment.development';

import { DashboardSummary } from '../../models/dashboard.model';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('requests the dashboard summary', () => {
    const response: DashboardSummary = {
      total_products: 128,
      total_stock_value: '250000.00',
      low_stock_count: 12,
      out_of_stock_count: 4
    };

    service.getSummary().subscribe((summary) => {
      expect(summary).toEqual(response);
    });

    const request = httpTestingController.expectOne(
      `${environment.apiUrl}/api/v1/products/summary`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });
});