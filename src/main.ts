import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { LarekApi } from "./utils/LarekApi";
import { ServerConnector } from "./components/communication/ServerConnector";

import { CatalogModel } from "./components/models/CatalogModel";
import { CartModel } from "./components/models/CartModel";
import { CustomerModel } from "./components/models/CustomerModel";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { Basket } from "./components/views/Basket";
import { Success } from "./components/views/Success";
import { ModulProductCard } from "./components/views/Card/ModulProductCard";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";

import { AppPresenter } from "./components/Presenter";
import { ensureElement, cloneTemplate } from "./utils/utils";

const events = new EventEmitter();
const api = new Api(API_URL);
const server = new ServerConnector(api);
const larekApi = new LarekApi();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");

const orderForm = new OrderForm(
  cloneTemplate<HTMLElement>(orderTemplate),
  events,
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLElement>(contactsTemplate),
  events,
);

// модели
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const customerModel = new CustomerModel(events);

const previewCard = new ModulProductCard(
  cloneTemplate<HTMLElement>(cardPreviewTemplate),
  {
    onBuyClick: () => events.emit("card:toBasket"),
  },
);

// представления
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
const basket = new Basket(cloneTemplate<HTMLElement>(basketTemplate), events);
const success = new Success(
  cloneTemplate<HTMLElement>(successTemplate),
  events,
);

// презентер
const appPresenter = new AppPresenter({
  larekApi,
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
  cardCatalogTemplate,
  previewCard,
  cardBasketTemplate,
});

// инициализация приложения
appPresenter.init();
