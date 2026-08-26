import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../features/dashboard/dashboard.module').then((module) => module.DashboardModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../features/products/products.module').then((module) => module.ProductsModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../features/categories/categories.module').then((module) => module.CategoriesModule)
      },
      {
        path: 'suppliers',
        loadChildren: () => import('../features/suppliers/suppliers.module').then((module) => module.SuppliersModule)
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
