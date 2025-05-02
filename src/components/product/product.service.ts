import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product, StockStatus } from './product.interface';
import { seedProducts } from './product.seed';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'products';
  private readonly DEFAULT_LOW_STOCK_THRESHOLD = 5;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor() {
    // Initialize with seed data if no products exist
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

  getProduct(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  addProduct(product: Omit<Product, 'id' | 'updatedAt'>): void {
    const products = this.productsSubject.value;
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      updatedAt: new Date(),
      lowStockThreshold: product.lowStockThreshold || this.DEFAULT_LOW_STOCK_THRESHOLD
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
        updatedAt: new Date()
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
    
    if (product.stock <= 0) {
      return {
        status: 'out',
        message: 'Out of Stock'
      };
    }
    
    if (product.stock <= threshold) {
      return {
        status: 'low',
        message: `Low Stock (${product.stock} left)`
      };
    }

    return {
      status: 'normal',
      message: `In Stock (${product.stock})`
    };
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(product => {
        const threshold = product.lowStockThreshold || this.DEFAULT_LOW_STOCK_THRESHOLD;
        return product.stock > 0 && product.stock <= threshold;
      }))
    );
  }

  getOutOfStockProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(product => product.stock <= 0))
    );
  }
}
