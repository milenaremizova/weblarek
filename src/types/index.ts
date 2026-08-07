export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface Product { 
    id: string; 
    title: string; 
    description: string; 
    image: string; 
    category: string; 
    price: number | null; 
};


export interface Buyer { 
    payment: 'card' | 'cash'; 
    address: string; 
    email: string; 
    phone: string; 
}

export interface OrderRequest {
  items: Product[];
  buyer: Buyer;
}

export interface OrderResponse {
  orderId: string;
  totalPrice: number;
  status: 'success' | 'pending';
}

export interface CatalogResponse {
  items: Product[];
} 