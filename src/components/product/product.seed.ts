import { Product, Category } from './product.interface';

const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: 'accessories', name: 'Accessories', description: 'Computer and device accessories' }
];

export const seedProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro X',
    sku: 'LPX-001',
    price: 1299.99,
    stockQuantity: 15,
    description: 'High-performance laptop with the latest processor and dedicated graphics.',
    updatedAt: new Date(),
    lowStockThreshold: 5,
    category: categories[0],
    tags: ['New', 'Popular']
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'WM-002',
    price: 29.99,
    stockQuantity: 50,
    description: 'Ergonomic wireless mouse with long battery life.',
    updatedAt: new Date(),
    lowStockThreshold: 10,
    category: categories[1],
    tags: ['Best Seller']
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    sku: 'MK-003',
    price: 89.99,
    stockQuantity: 30,
    description: 'Premium mechanical keyboard with RGB backlighting.',
    updatedAt: new Date(),
    lowStockThreshold: 8,
    category: categories[1],
    tags: ['Popular', 'Limited Edition']
  }
];
