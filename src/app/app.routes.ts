import { Routes } from '@angular/router';
import { LandingComponent } from '../components/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'products',
    children: [
      {
        path: '',
        loadComponent: () => import('../components/product/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('../components/product/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('../components/product/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('../components/product/product-form/product-form.component').then(m => m.ProductFormComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
