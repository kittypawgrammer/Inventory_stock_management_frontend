import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SuplierFormComponent } from './pages/suplier-form/suplier-form.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent
  },
  {
    path: 'add',
    component: SuplierFormComponent
  },
  {
    path: 'edit/:id',
    component: SuplierFormComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SuppliersRoutingModule { }
