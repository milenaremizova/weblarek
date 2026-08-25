import { LarekApi } from "../utils/LarekApi";
import { cloneTemplate } from "../utils/utils";
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
import { ModulProductCard } from "./views/Card/ModulProductCard";
import { CartItemCard } from "./views/Card/CartItemCard";
import { CatalogCard } from "./views/Card/CatalogCard";
import { OrderForm } from "./views/Form/OrderForm";
import { ContactsForm } from "./views/Form/ContactsForm";

import { IBuyer, OrderRequest, Product, IButtonState } from "../types";

export class AppPresenter {
  private larekApi: LarekApi;
  private events: IEvents;
  private catalogModel: CatalogModel;
  private cartModel: CartModel;
  private customerModel: CustomerModel;
  private server: ServerConnector;

  private header: Header;
  private gallery: Gallery;
  private modal: Modal;
  private basket: Basket;
  private orderTemplate: HTMLTemplateElement;
  private contactsTemplate: HTMLTemplateElement;
  private currentOrderForm: OrderForm | null = null;
  private currentContactsForm: ContactsForm | null = null;
  private success: Success;
  private cardCatalogTemplate: HTMLTemplateElement;
  private previewCard: ModulProductCard;
  private cardBasketTemplate: HTMLTemplateElement;

  constructor(deps: IPresenter) {
    this.larekApi = deps.larekApi;
    this.events = deps.events;
    this.catalogModel = deps.catalogModel;
    this.cartModel = deps.cartModel;
    this.customerModel = deps.customerModel;
    this.server = deps.server;

    this.header = deps.header;
    this.gallery = deps.gallery;
    this.modal = deps.modal;
    this.basket = deps.basket;
    this.orderTemplate = deps.orderTemplate;
    this.contactsTemplate = deps.contactsTemplate;
    this.success = deps.success;
    this.cardCatalogTemplate = deps.cardCatalogTemplate;
    this.cardBasketTemplate = deps.cardBasketTemplate;
    this.previewCard = deps.previewCard;

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
  async init(): Promise<void> {
  try {
    const response = await this.server.fetchCatalog();
    const preparedItems = this.larekApi.prepareProducts(response);
    this.catalogModel.setProducts(preparedItems);
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
}

  private renderGallery(): void {
    const items = this.catalogModel.getProducts().map((product) => {
      const cardContainer = cloneTemplate<HTMLElement>(
        this.cardCatalogTemplate,
      );

      const card = new CatalogCard(cardContainer, {
        onClick: () => this.events.emit("card:click", { id: product.id }),
      });

      return card.render({
        title: product.title,
        price: product.price,
        image: { src: product.image, alt: product.title },
        category: product.category,
      });
    });

    this.gallery.items = items;
  }
  private renderBasket(): HTMLElement {
    const items = this.cartModel.getItems().map((product, index) => {
      const container = cloneTemplate<HTMLElement>(this.cardBasketTemplate);

      const card = new CartItemCard(container, {
        onDeleteClick: () => this.cartModel.removeItem(product.id),
      });

      return card.render({
        title: product.title,
        price: product.price,
        index: index + 1,
      });
    });

    return this.basket.render({
      items,
      total: this.cartModel.getTotalPrice(),
      valid: this.cartModel.getCount() > 0,
    });
  }

  private renderPreview(product: Product): void {
    const buttonState: IButtonState = this.getPreviewButtonState(product);

    const rendered = this.previewCard.render({
      title: product.title,
      price: product.price,
      description: product.description,
      image: { src: product.image, alt: product.title },
      category: product.category,
      buttonState,
    });

    this.modal.render({ content: rendered });
    this.modal.open();
  }

  private getPreviewButtonState(product: Product): IButtonState {
    if (product.price === null) {
      return { text: "Недоступно", disabled: true };
    }
    if (this.cartModel.hasItem(product.id)) {
      return { text: "Удалить из корзины", disabled: false };
    }
    return { text: "В корзину", disabled: false };
  }

  private renderOrderForm(): HTMLElement {
    const container = cloneTemplate<HTMLElement>(this.orderTemplate);
    this.currentOrderForm = new OrderForm(container, this.events);

    const buyer = this.customerModel.getData();
    const errors = this.customerModel.validate();

    return this.currentOrderForm.render({
      payment: buyer.payment,
      address: buyer.address,
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(Boolean).join(". "),
    });
  }

  private updateOrderForm(): void {
    if (!this.currentOrderForm) return;

    const buyer = this.customerModel.getData();
    const errors = this.customerModel.validate();

    this.currentOrderForm.render({
      payment: buyer.payment,
      address: buyer.address,
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(Boolean).join(". "),
    });
  }

  private renderContactsForm(): HTMLElement {
    const container = cloneTemplate<HTMLElement>(this.contactsTemplate);
    this.currentContactsForm = new ContactsForm(container, this.events);

    const buyer = this.customerModel.getData();
    const errors = this.customerModel.validate();

    return this.currentContactsForm.render({
      email: buyer.email,
      phone: buyer.phone,
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter(Boolean).join(". "),
    });
  }

  private updateContactsForm(): void {
    if (!this.currentContactsForm) return;

    const buyer = this.customerModel.getData();
    const errors = this.customerModel.validate();

    this.currentContactsForm.render({
      email: buyer.email,
      phone: buyer.phone,
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter(Boolean).join(". "),
    });
  }

  // обработчики, models
  private handleCatalogChanged(): void {
    this.renderGallery();
  }

  private handlePreviewChanged(): void {
    const product = this.catalogModel.getSelectedProduct();
    if (product) this.renderPreview(product);
  }

  private handleBasketChanged(): void {
    this.header.counter = this.cartModel.getCount();
    this.renderBasket();
  }

  private handleCustomerChanged(): void {
    this.updateOrderForm();
    this.updateContactsForm();
  }

  // обработчики, views
  private handleCardClick(data: { id: string }): void {
    this.catalogModel.setSelectedProduct(data.id);
  }

  private handleToBasket(): void {
    const product = this.catalogModel.getSelectedProduct();
    if (!product) return;

    if (this.cartModel.hasItem(product.id)) {
      this.cartModel.removeItem(product.id);
    } else {
      this.cartModel.addItem(product);
    }
    this.modal.close();
  }

  private handleBasketOpen(): void {
    this.modal.render({ content: this.renderBasket() });
    this.modal.open();
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
    this.modal.render({ content: this.renderContactsForm() });
  }

  private handleContactsSubmit(): void {
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
