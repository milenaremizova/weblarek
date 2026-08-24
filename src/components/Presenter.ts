import { IPresenter } from "../types";

import { IEvents } from "./base/Events";
import { CatalogModel } from "./models/CatalogModel";
import { CartModel } from "./models/CartModel";
import { CustomerModel } from "./models/CustomerModel";
import { ServerConnector } from "./communication/ServerConnector";

import { Header } from "./views/Header";
import { Gallery } from "./views/Gallery";
import { Modal } from "./views/Modal";
import { Basket } from "./views/Basket";
import { Success } from "./views/Success";
import { ModulProductCard } from "./views/Card/ModalProductCard";
import { CartItemCard } from "./views/Card/CartItemCard";
import { OrderForm } from "./views/Form/OrderForm";
import { ContactsForm } from "./views/Form/ContactsForm";

import { IBuyer, OrderRequest, Product } from "../types";

export class AppPresenter {
  private events: IEvents;
  private catalogModel: CatalogModel;
  private cartModel: CartModel;
  private customerModel: CustomerModel;
  private server: ServerConnector;

  private header: Header;
  private gallery: Gallery;
  private modal: Modal;
  private basket: Basket;
  private orderForm: OrderForm;
  private contactsForm: ContactsForm;
  private success: Success;

  constructor(deps: IPresenter) {
    this.events = deps.events;
    this.catalogModel = deps.catalogModel;
    this.cartModel = deps.cartModel;
    this.customerModel = deps.customerModel;
    this.server = deps.server;

    this.header = deps.header;
    this.gallery = deps.gallery;
    this.modal = deps.modal;
    this.basket = deps.basket;
    this.orderForm = deps.orderForm;
    this.contactsForm = deps.contactsForm;
    this.success = deps.success;

    this.subscribe();
  }

  // Подписки на события
  private subscribe(): void {
    // события моделей
    this.events.on("catalog:changed", this.handleCatalogChanged.bind(this));
    this.events.on("preview:changed", this.handlePreviewChanged.bind(this));
    this.events.on("basket:changed", this.handleBasketChanged.bind(this));
    this.events.on("customer:changed", this.handleCustomerChanged.bind(this));

    // события представлений
    this.events.on("card:click", this.handleCardClick.bind(this));
    this.events.on("card:toBasket", this.handleToBasket.bind(this));
    this.events.on("basket:open", this.handleBasketOpen.bind(this));
    this.events.on("basket:remove", this.handleBasketRemove.bind(this));
    this.events.on("order:open", this.handleOrderOpen.bind(this));
    this.events.on("order:change", this.handleCustomerFieldChange.bind(this));
    this.events.on("order:submit", this.handleOrderSubmit.bind(this));
    this.events.on(
      "contacts:change",
      this.handleCustomerFieldChange.bind(this),
    );
    this.events.on("contacts:submit", this.handleContactsSubmit.bind(this));
    this.events.on("success:close", this.handleSuccessClose.bind(this));
  }

  // вспомогательные методы
  private renderBasket(): HTMLElement {
    const items = this.cartModel.getItems().map((product, index) => {
      const card = new CartItemCard(this.events);
      return card.render({ ...product, index: index + 1 });
    });

    return this.basket.render({
      items,
      total: this.cartModel.getTotalPrice(),
      valid: this.cartModel.getCount() > 0,
    });
  }

  private renderPreview(product: Product): void {
    const card = new ModulProductCard(this.events);
    const buttonState =
      product.price === null
        ? "disabled"
        : this.cartModel.hasItem(product.id)
          ? "remove"
          : "buy";

    const rendered = card.render({ ...product, buttonState });
    this.modal.render({ content: rendered });
    this.modal.open();
  }

  private renderOrderForm(): HTMLElement {
    const buyer = this.customerModel.getData();
    const errors = this.customerModel.validate();

    return this.orderForm.render({
      payment: buyer.payment,
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(Boolean).join(". "),
    });
  }

  private renderContactsForm(): HTMLElement {
    const errors = this.customerModel.validate();

    return this.contactsForm.render({
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter(Boolean).join(". "),
    });
  }

  // обработчики, models
  private handleCatalogChanged(data: { products: Product[] }): void {
    this.gallery.products = data.products;
  }

  private handlePreviewChanged(data: { product: Product }): void {
    this.renderPreview(data.product);
  }

  private handleBasketChanged(data: { items: Product[] }): void {
    this.header.counter = data.items.length;
    this.renderBasket();
  }

  private handleCustomerChanged(): void {
    this.renderOrderForm();
    this.renderContactsForm();
  }

  // обработчики, views
  private handleCardClick(data: { id: string }): void {
    this.catalogModel.setSelectedProduct(data.id);
  }

  private handleToBasket(data: { id: string }): void {
    if (this.cartModel.hasItem(data.id)) {
      this.cartModel.removeItem(data.id);
    } else {
      const product = this.catalogModel.findProductById(data.id);
      if (product) this.cartModel.addItem(product);
    }

    const selected = this.catalogModel.getSelectedProduct();
    if (selected && selected.id === data.id) {
      this.renderPreview(selected);
    }
  }

  private handleBasketOpen(): void {
    this.modal.render({ content: this.renderBasket() });
    this.modal.open();
  }

  private handleBasketRemove(data: { id: string }): void {
    this.cartModel.removeItem(data.id);
  }

  private handleOrderOpen(): void {
    this.modal.render({ content: this.renderOrderForm() });
    this.modal.open();
  }

  private handleCustomerFieldChange(data: {
    field: string;
    value: string;
  }): void {
    this.customerModel.updateData({
      [data.field]: data.value,
    } as Partial<IBuyer>);
  }

  private handleOrderSubmit(): void {
    const errors = this.customerModel.validate();
    if (errors.payment || errors.address) return;

    this.modal.render({ content: this.renderContactsForm() });
  }

  private handleContactsSubmit(): void {
    const errors = this.customerModel.validate();
    if (Object.keys(errors).length) return;

    const buyer = this.customerModel.getData();
    const orderPayload: OrderRequest = {
      ...buyer,
      total: this.cartModel.getTotalPrice(),
      items: this.cartModel.getItems().map((item) => item.id),
    };

    this.server
      .sendOrder(orderPayload)
      .then((response) => {
        this.modal.render({
          content: this.success.render({ total: response.total }),
        });
        this.cartModel.clear();
        this.customerModel.clear();
      })
      .catch((error) => {
        console.error("Ошибка оформления заказа:", error);
      });
  }

  private handleSuccessClose(): void {
    this.modal.close();
  }
}
