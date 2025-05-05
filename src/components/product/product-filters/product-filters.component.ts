import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProductService } from '../product.service';
import { Category } from '../product.interface';
import { ProductFilters } from '../product-filter.interface';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss']
})
export class ProductFiltersComponent implements OnInit {
  filters$!: Observable<ProductFilters>;
  availableTags$!: Observable<string[]>;
  priceRange$!: Observable<{ min: number; max: number }>;
  
  categories: Category[] = [
    { id: 'electronics', name: 'Electronics', description: 'Electronic devices and accessories' },
    { id: 'clothing', name: 'Clothing', description: 'Apparel and fashion items' },
    { id: 'books', name: 'Books', description: 'Books and publications' },
    { id: 'home', name: 'Home & Living', description: 'Home decor and furniture' }
  ];

  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'stock', label: 'Stock' }
  ];

  constructor(private productService: ProductService) {
    this.filters$ = this.productService.filters$;
    this.availableTags$ = this.productService.getAvailableTags();
    this.priceRange$ = this.productService.getPriceRange();
  }

  ngOnInit(): void {}

  onSearchChange(query: string): void {
    this.productService.updateFilters({ searchQuery: query });
  }

  onCategoryChange(categoryId: string | null): void {
    const category = categoryId ? this.categories.find(c => c.id === categoryId) : null;
    this.productService.updateFilters({ category: category || undefined });
  }

  onMinPriceChange(min: number, range: { min: number; max: number }): void {
    this.filters$.pipe(take(1)).subscribe(currentFilters => {
      const currentMax = currentFilters.priceRange?.max || range.max;
      this.productService.updateFilters({
        priceRange: { min, max: currentMax }
      });
    });
  }

  onMaxPriceChange(max: number, range: { min: number; max: number }): void {
    this.filters$.pipe(take(1)).subscribe(currentFilters => {
      const currentMin = currentFilters.priceRange?.min || range.min;
      this.productService.updateFilters({
        priceRange: { min: currentMin, max }
      });
    });
  }

  onTagChange(event: Event, tag: string): void {
    const checkbox = event.target as HTMLInputElement;
    this.filters$.pipe(take(1)).subscribe(currentFilters => {
      const tags = checkbox.checked
        ? [...currentFilters.tags, tag]
        : currentFilters.tags.filter(t => t !== tag);
      this.productService.updateFilters({ tags });
    });
  }

  onSortChange(sortBy: 'name' | 'price' | 'stock'): void {
    this.productService.updateFilters({ sortBy });
  }

  onSortDirectionChange(direction: 'asc' | 'desc'): void {
    this.productService.updateFilters({ sortDirection: direction });
  }

  resetFilters(): void {
    this.productService.resetFilters();
  }
}
