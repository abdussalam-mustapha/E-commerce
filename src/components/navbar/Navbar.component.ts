import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() layout: 'layoutA' | 'layoutB' | 'layoutC' = 'layoutA';

  constructor(private router: Router) {}

  navigateToProducts() {
    this.router.navigate(['/products']);
  }
}
