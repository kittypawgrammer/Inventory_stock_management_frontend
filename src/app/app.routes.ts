import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./features/dashboard/dashboard.module')
				.then((module) => module.DashboardModule)
	},

     {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.module')
        .then(m => m.ProductsModule)
  },
];
