// src/components/Gallery.ts
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IGallery } from "../../types";
import { CatalogCard } from "./Card/CatalogCard";

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;
  private _products: any[] = [];

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.catalogElement = container;

    this.events.on("card:click", (data) => {
      console.log("Клик на карточке в галерее:", data);
    });
  }

  set products(items: any[]) {
    this._products = items;
    this.render();
  }

  render(): HTMLElement {
    // очистка контейнера без innerHtml
    while (this.catalogElement.firstChild) {
      this.catalogElement.removeChild(this.catalogElement.firstChild);
    }

    this._products.forEach((product) => {
      const card = new CatalogCard(this.events, product);

      const renderedCard = card.render();

      this.catalogElement.appendChild(renderedCard);
    });

    return this.catalogElement;
  }
}
