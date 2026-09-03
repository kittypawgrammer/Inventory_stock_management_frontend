import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment.development';
import { ProductService } from './product.service';

//creates test groups for produsctService
describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads products from the API', () => {
    const apiResponse = {
      items: [
        {
          id: 1,
          name: 'Laptop',
          sku: 'LAP-001',
          category_id: 5,
          supplier_id: 9,
          unit_price: '1200.00',
          quantity_in_stock: 12,
          reorder_level: 4,
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-02T00:00:00Z',
          stock_status: 'low stock'
        }
      ],
      page: 1,
      page_size: 10,
      total: 1,
      total_pages: 1
    };

    service.getProducts().subscribe((products) => {
      expect(products).toEqual([
        jasmine.objectContaining({
          id: 1,
          name: 'Laptop',
          sku: 'LAP-001',
          category_id: 5,
          supplier_id: 9,
          unit_price: 1200,
          quantity_in_stock: 12,
          reorder_level: 4,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
          stock_status: 'Low Stock'
        })
      ]);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/api/v1/products`);
    expect(request.request.method).toBe('GET');
    request.flush(apiResponse);
  });
});
