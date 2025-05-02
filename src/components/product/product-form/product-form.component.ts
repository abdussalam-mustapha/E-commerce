import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  private productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      lowStockThreshold: [5, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe(product => {
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          price: product.price,
          stock: product.stock,
          description: product.description,
          lowStockThreshold: product.lowStockThreshold || 5
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      
      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, productData);
      } else {
        this.productService.addProduct(productData);
      }

      this.router.navigate(['/products']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
