export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  updatedAt: Date;
  lowStockThreshold?: number;
}

export interface StockStatus {
  status: 'normal' | 'low' | 'out';
  message: string;
}
