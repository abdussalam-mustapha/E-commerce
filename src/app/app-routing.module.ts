import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from '../components/product/product.component';
import { AppComponent } from './app.component';
import { LandingComponent } from '../components/landing/landing.component';


const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'products',
    component: ProductComponent 
  },
  // { path: 'products',
  //  loadComponent: ()=> import ('../components/product/product.component').then((m) => m.ProductComponent),
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export { routes }
