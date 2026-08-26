import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SuppliersComponent } from './suppliers.component';


@NgModule({
  declarations: [SuppliersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SuppliersComponent }])
  ]
})
export class SuppliersModule { }
