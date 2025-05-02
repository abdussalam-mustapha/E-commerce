import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../product.interface';
import { ProductService } from '../product.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, DatePipe]
})
export class ProductDetailComponent implements OnInit {
  product$: Observable<Product | undefined>;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => this.productService.getProduct(params.get('id') || ''))
    );
  }

  ngOnInit(): void {}

  onEdit(id: string): void {
    this.router.navigate(['/products', id, 'edit']);
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
      this.router.navigate(['/products']);
    }
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }
}
