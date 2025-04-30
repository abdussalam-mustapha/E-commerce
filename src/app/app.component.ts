import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/Navbar.component';
import { LandingComponent } from '../components/landing/landing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LandingComponent],
  template: `
    <app-navbar [layout]="'layoutA'"></app-navbar>
    <app-landing></app-landing>
    <router-outlet />
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-commerce';
}
