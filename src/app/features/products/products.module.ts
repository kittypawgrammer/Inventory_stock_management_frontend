import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductsFormComponent } from './pages/products-form/products-form.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';

@NgModule({
  declarations: [
    ProductsFormComponent,
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule, 
    ReactiveFormsModule
  ]
})
export class ProductsModule { }