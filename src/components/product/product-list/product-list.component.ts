import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductService } from '../product.service';
import { Product, StockStatus } from '../product.interface';
import { ProductFiltersComponent } from '../product-filters/product-filters.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductFiltersComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  products$: Observable<Product[]>;
  lowStockProducts$: Observable<Product[]>;
  outOfStockProducts$: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.products$ = this.productService.filteredProducts$;
    this.lowStockProducts$ = this.productService.getLowStockProducts();
    this.outOfStockProducts$ = this.productService.getOutOfStockProducts();
  }

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

  getStockStatusClass(product: Product): string {
    const status = this.getStockStatus(product).status;
    return `stock-status-${status}`;
  }
}
