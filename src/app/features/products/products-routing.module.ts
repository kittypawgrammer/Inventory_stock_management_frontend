import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductsFormComponent } from './pages/products-form/products-form.component';



const routes: Routes = [
  { path: '',
    component: ProductsListComponent
  },

  { path: 'add', 
    component: ProductsFormComponent 
  },

  { path: 'edit/:id', 
    component: ProductsFormComponent 
  }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductsRoutingModule { }
