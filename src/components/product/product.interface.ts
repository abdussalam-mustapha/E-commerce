export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  category?: Category;
  tags: string[];
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface StockStatus {
  status: 'out' | 'low' | 'normal';
  message: string;
}
