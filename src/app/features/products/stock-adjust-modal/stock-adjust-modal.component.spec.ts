import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustModalComponent } from './stock-adjust-modal.component';

describe('StockAdjustModalComponent', () => {
  let component: StockAdjustModalComponent;
  let fixture: ComponentFixture<StockAdjustModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockAdjustModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockAdjustModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
