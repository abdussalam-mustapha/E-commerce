import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/Navbar.component';
import { LandingComponent } from '../components/landing/landing.component';
import { ProductComponent } from '../components/product/product.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LandingComponent, ProductComponent],
  template: `
    <app-navbar [layout]="'layoutA'"></app-navbar>
    <!-- <app-product></app-product> -->
    <!-- <app-landing></app-landing> -->
    <router-outlet />
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-commerce';
}
