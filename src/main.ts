import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { LarekApi } from "./components/base/LarekApi";
import { ServerConnector } from "./components/communication/ServerConnector";

import { CatalogModel } from "./components/models/CatalogModel";
import { CartModel } from "./components/models/CartModel";
import { CustomerModel } from "./components/models/CustomerModel";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { Success } from "./components/views/Success";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";

import { AppPresenter } from "./components/Presenter";
import { ensureElement } from "./utils/utils";


const events = new EventEmitter();
const api = new Api(API_URL);
const server = new ServerConnector(api);
const larekApi = new LarekApi();

// модели
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const customerModel = new CustomerModel(events);

// представления
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(events, ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basket = new Basket(
  basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
  events,
);

const orderForm = new OrderForm(events);
const contactsForm = new ContactsForm(events);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const success = new Success(
  successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement,
  events,
);

// презентер
new AppPresenter({
  events,
  catalogModel,
  cartModel,
  customerModel,
  server,
  header,
  gallery,
  modal,
  basket,
  orderForm,
  contactsForm,
  success,
});

// звгрузка каталога
async function init() {
  try {
    const response = await server.fetchCatalog();
    const preparedItems = larekApi.prepareProducts(response);
    catalogModel.setProducts(preparedItems);
  } catch (error) {
    console.error('Ошибка при загрузке каталога:', error);
  }
}

init();