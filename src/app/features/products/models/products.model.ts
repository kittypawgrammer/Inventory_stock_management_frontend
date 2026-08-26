import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})


export class ModelsModule {
  id?: number;
  name: string;
  description: string;
  sku: string;
  category: string;
  supplier: string;
  unitPrice: number;
  quantity: number;
  reorderLevel: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl?: string;
}
