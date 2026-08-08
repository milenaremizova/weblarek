export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TPayment = "card" | "cash";
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  address: string;
  email: string;
  phone: string;
}

export interface OrderRequest extends IBuyer {
  total: number;
  items: string[];
}

export interface OrderResponse {
  id: string;
  total: number;
}

export interface CatalogResponse {
  items: Product[];
  total: number;
}
