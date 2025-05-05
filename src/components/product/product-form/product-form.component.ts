import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product, Category } from '../product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  product: Partial<Product> = {
    name: '',
    sku: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    lowStockThreshold: 5,
    category: undefined,
    tags: []
  };

  categories: Category[] = [
    { id: 'electronics', name: 'Electronics', description: 'Electronic devices and accessories' },
    { id: 'clothing', name: 'Clothing', description: 'Apparel and fashion items' },
    { id: 'books', name: 'Books', description: 'Books and publications' },
    { id: 'home', name: 'Home & Living', description: 'Home decor and furniture' }
  ];

  isEditing = false;
  newTag = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditing = true;
      const existingProduct = this.productService.getProduct(productId);
      if (existingProduct) {
        this.product = { ...existingProduct };
      } else {
        this.router.navigate(['/products']);
      }
    }
  }

  onSubmit(): void {
    const productData = {
      ...this.product,
      tags: this.product.tags || []
    };

    if (this.isEditing && productData.id) {
      this.productService.updateProduct(productData.id, productData);
    } else {
      this.productService.addProduct(productData as Omit<Product, 'id' | 'updatedAt'>);
    }
    this.router.navigate(['/products']);
  }

  addTag(): void {
    if (this.newTag && !this.product.tags?.includes(this.newTag)) {
      this.product.tags = [...(this.product.tags || []), this.newTag];
      this.newTag = '';
    }
  }

  removeTag(tag: string): void {
    this.product.tags = this.product.tags?.filter(t => t !== tag) || [];
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
