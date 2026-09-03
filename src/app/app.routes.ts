import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  //layout module
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./layout/layout.module').then(m => m.LayoutModule)
  },

  //auth module
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  

  //unkown url
  {
    path: '**',
    redirectTo: ''
  }
];