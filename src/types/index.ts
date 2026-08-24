
// добавлены import type для описания типа зависимостей презентера. если бы я импортировала обычным импортом, то получилась бы циклическая зависимость. ее удалось избежать
// import type нужен только для проверки типов, полностью удаляется компилятором при сборке
import type { IEvents } from "../components/base/Events";
import type { CatalogModel } from "../components/models/CatalogModel";
import type { CartModel } from "../components/models/CartModel";
import type { CustomerModel } from "../components/models/CustomerModel";
import type { ServerConnector } from "../components/communication/ServerConnector";
import type { Header } from "../components/views/Header";
import type { Gallery } from "../components/views/Gallery";
import type { Modal } from "../components/views/Modal";
import type { Basket } from "../components/views/Basket";
import type { OrderForm } from "../components/views/Form/OrderForm";
import type { ContactsForm } from "../components/views/Form/ContactsForm";
import type { Success } from "../components/views/Success";
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

export interface IHeader {
  counter: number;
}

export interface IGallery {}

export type CardButtonState = "buy" | "remove" | "disabled";

export interface ICardData {
  id: string;
  description: string;
  image: string;
  title: string;
  price: number | null;
  category: string;
  index?: number;
  buttonState?: CardButtonState;
}

export interface IFormState {
  valid: boolean;
  errors: string;
}

 export interface IOrderFormData {
  payment: TPayment | null;
  address: string;
}

export interface IContactsFormData {
  email: string;
  phone: string;
}

export interface IModalData {
  content: HTMLElement;
}

export interface IBasketData {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

export interface ISuccessData {
  total: number;
}

export interface IPresenter {
  events: IEvents;
  catalogModel: CatalogModel;
  cartModel: CartModel;
  customerModel: CustomerModel;
  server: ServerConnector;
  header: Header;
  gallery: Gallery;
  modal: Modal;
  basket: Basket;
  orderForm: OrderForm;
  contactsForm: ContactsForm;
  success: Success;
}
