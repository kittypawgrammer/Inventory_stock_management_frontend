import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesListComponent } from './pages/categories-list/categories-list.component';
import { CategoriesFormComponent } from './pages/categories-form/categories-form.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesListComponent
  },
  {
    path: 'add',
    component: CategoriesFormComponent
  },
  {
    path: 'edit/:id',
    component: CategoriesFormComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CategoriesRoutingModule { }
