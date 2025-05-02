import { Product } from './product.interface';

export const seedProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro X',
    sku: 'LPX-001',
    price: 1299.99,
    stock: 15,
    description: 'High-performance laptop with the latest processor and dedicated graphics.',
    updatedAt: new Date(),
    lowStockThreshold: 5
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    sku: 'WM-002',
    price: 29.99,
    stock: 50,
    description: 'Ergonomic wireless mouse with long battery life.',
    updatedAt: new Date(),
    lowStockThreshold: 10
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    sku: 'MK-003',
    price: 89.99,
    stock: 30,
    description: 'Premium mechanical keyboard with RGB backlighting.',
    updatedAt: new Date(),
    lowStockThreshold: 8
  }
];
