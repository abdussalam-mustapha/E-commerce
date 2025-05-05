import { Category } from './product.interface';

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductFilters {
  searchQuery: string;
  category?: Category;
  priceRange?: PriceRange;
  tags: string[];
  sortBy: 'name' | 'price' | 'stock';
  sortDirection: 'asc' | 'desc';
}

export const DEFAULT_FILTERS: ProductFilters = {
  searchQuery: '',
  tags: [],
  sortBy: 'name',
  sortDirection: 'asc'
};
