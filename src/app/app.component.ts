import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/Navbar.component';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar [layout]="'layoutA'"></app-navbar>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-commerce';
}
