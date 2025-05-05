import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Product, StockStatus } from './product.interface';
import { ProductFilters, DEFAULT_FILTERS } from './product-filter.interface';
import { seedProducts } from './product.seed';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products';
  private readonly FILTERS_STORAGE_KEY = 'product_filters';
  private readonly DEFAULT_LOW_STOCK_THRESHOLD = 5;
  
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private filtersSubject = new BehaviorSubject<ProductFilters>({
    searchQuery: '',
    category: undefined,
    priceRange: undefined,
    tags: [],
    sortBy: 'name',
    sortDirection: 'asc'
  });
  
  products$ = this.productsSubject.asObservable();
  filters$ = this.filtersSubject.asObservable();
  
  filteredProducts$ = combineLatest([this.products$, this.filters$]).pipe(
    map(([products, filters]) => this.applyFilters(products, filters))
  );

  constructor() {
    if (this.loadProducts().length === 0) {
      this.saveProducts(seedProducts);
    } else {
      this.loadProducts();
    }
  }

  private loadProducts(): Product[] {
    const storedProducts = localStorage.getItem(this.STORAGE_KEY);
    if (storedProducts) {
      const products: Product[] = JSON.parse(storedProducts);
      // Ensure all products have a lowStockThreshold
      const updatedProducts = products.map(product => ({
        ...product,
        lowStockThreshold: product.lowStockThreshold || this.DEFAULT_LOW_STOCK_THRESHOLD
      }));
      this.productsSubject.next(updatedProducts);
      return updatedProducts;
    }
    return [];
  }

  private saveProducts(products: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    this.productsSubject.next(products);
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProduct(id: string): Product | undefined {
    return this.productsSubject.value.find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id' | 'updatedAt'>): void {
    const products = this.productsSubject.value;
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      updatedAt: new Date(),
      lowStockThreshold: product.lowStockThreshold || this.DEFAULT_LOW_STOCK_THRESHOLD,
      tags: product.tags || []
    };
    this.saveProducts([...products, newProduct]);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    const products = this.productsSubject.value;
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedProduct = {
        ...products[index],
        ...updates,
        updatedAt: new Date(),
        tags: updates.tags || products[index].tags || []
      };
      products[index] = updatedProduct;
      this.saveProducts(products);
    }
  }

  deleteProduct(id: string): void {
    const products = this.productsSubject.value;
    this.saveProducts(products.filter(p => p.id !== id));
  }

  getStockStatus(product: Product): StockStatus {
    const threshold = product.lowStockThreshold || this.DEFAULT_LOW_STOCK_THRESHOLD;
    
    if (product.stockQuantity <= 0) {
      return {
        status: 'out',
        message: 'Out of Stock'
      };
    }
    
    if (product.stockQuantity <= threshold) {
      return {
        status: 'low',
        message: `Low Stock (${product.stockQuantity} left)`
      };
    }

    return {
      status: 'normal',
      message: `In Stock (${product.stockQuantity})`
    };
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(product => {
        const threshold = product.lowStockThreshold || this.DEFAULT_LOW_STOCK_THRESHOLD;
        return product.stockQuantity > 0 && product.stockQuantity <= threshold;
      }))
    );
  }

  getOutOfStockProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(product => product.stockQuantity <= 0))
    );
  }

  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    let filtered = [...products];

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product =>
        product.category?.id === filters.category?.id
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        (!(filters.priceRange && filters.priceRange.min) || product.price >= (filters.priceRange?.min ?? 0)) &&
        (!(filters.priceRange && filters.priceRange.max) || product.price <= (filters.priceRange?.max ?? Infinity))
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(product =>
        filters.tags.every(tag => product.tags?.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = a.stockQuantity - b.stockQuantity;
          break;
      }
      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }

  private loadFilters(): ProductFilters {
    const stored = localStorage.getItem(this.FILTERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      searchQuery: '',
      category: undefined,
      priceRange: undefined,
      tags: [],
      sortBy: 'name',
      sortDirection: 'asc'
    };
  }

  private saveFilters(filters: ProductFilters): void {
    localStorage.setItem(this.FILTERS_STORAGE_KEY, JSON.stringify(filters));
    this.filtersSubject.next(filters);
  }

  updateFilters(updates: Partial<ProductFilters>): void {
    const currentFilters = this.filtersSubject.value;
    const newFilters = {
      ...currentFilters,
      ...updates
    };
    this.saveFilters(newFilters);
  }

  resetFilters(): void {
    this.saveFilters({
      searchQuery: '',
      category: undefined,
      priceRange: undefined,
      tags: [],
      sortBy: 'name',
      sortDirection: 'asc'
    });
  }

  getAvailableTags(): Observable<string[]> {
    return this.products$.pipe(
      map(products => {
        const tagSet = new Set<string>();
        products.forEach(product => {
          product.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
      })
    );
  }

  getPriceRange(): Observable<{ min: number; max: number }> {
    return this.products$.pipe(
      map(products => {
        if (products.length === 0) {
          return { min: 0, max: 1000 };
        }
        const prices = products.map(p => p.price);
        return {
          min: Math.min(...prices),
          max: Math.max(...prices)
        };
      })
    );
  }
}
