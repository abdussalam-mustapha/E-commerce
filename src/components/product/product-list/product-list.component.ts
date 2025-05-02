import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../product.service';
import { Product, StockStatus } from '../product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  lowStockProducts$: Observable<Product[]>;
  outOfStockProducts$: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.products$ = this.productService.getProducts();
    this.lowStockProducts$ = this.productService.getLowStockProducts();
    this.outOfStockProducts$ = this.productService.getOutOfStockProducts();
  }

  ngOnInit(): void {}

  onAddProduct(): void {
    this.router.navigate(['/products/new']);
  }

  onEditProduct(id: string): void {
    this.router.navigate(['/products', id, 'edit']);
  }

  onProductClick(id: string): void {
    this.router.navigate(['/products', id]);
  }

  getStockStatus(product: Product): StockStatus {
    return this.productService.getStockStatus(product);
  }

  getStockStatusClass(product: Product): { [key: string]: boolean } {
    const status = this.getStockStatus(product).status;
    return {
      'stock-badge': true,
      'stock-normal': status === 'normal',
      'stock-low': status === 'low',
      'stock-out': status === 'out'
    };
  }
}
