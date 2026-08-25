import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { StockAdjustModalComponent } from './stock-adjust-modal/stock-adjust-modal.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
    StockAdjustModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProductsModule { }