export interface Product {
  id?: string;
  name: string;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

export interface CreateProduct extends Omit<Product, 'id'> {}
export interface UpdateProduct extends Product {}