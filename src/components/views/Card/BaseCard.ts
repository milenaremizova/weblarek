import { Component } from "../../base/Component";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";
import { ICardData } from "../../../types";

// выбран абстрактный класс, так как от него нельзя создать объект напрямую, потому что используется как база для карточек
export abstract class BaseCard extends Component<ICardData> {
  protected titleEl: HTMLElement | null;
  protected priceEl: HTMLElement | null;
  protected categoryEl: HTMLElement | null;
  protected imgEl: HTMLImageElement | null;
  protected descEl: HTMLElement | null;
  protected events: IEvents;
  protected cardId: string = "";

  constructor(events: IEvents, container: HTMLElement) {
    super(container);
    this.events = events;

    this.titleEl = container.querySelector(".card__title");
    this.priceEl = container.querySelector(".card__price");
    this.categoryEl = container.querySelector(".card__category");
    this.imgEl = container.querySelector(".card__image");
    this.descEl = container.querySelector(".card__text");

    container.addEventListener("click", () => {
      this.events.emit("card:click", { id: this.cardId });
    });
  }

  set id(value: string) {
    this.cardId = value;
  }

  set title(value: string) {
    if (this.titleEl) this.titleEl.textContent = value;
  }

  set price(value: number | null) {
    if (this.priceEl) {
      this.priceEl.textContent = value ? `${value} синапсов` : "Бесценно";
    }
  }

  set category(value: string) {
    if (!this.categoryEl) return;
    this.categoryEl.textContent = value;
    this.categoryEl.className = "card__category";
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) this.categoryEl.classList.add(modifier);
  }

  set image(value: string) {
    if (this.imgEl) this.setImage(this.imgEl, value, this.titleEl?.textContent ?? "");
  }

  set description(value: string) {
    if (this.descEl) this.descEl.textContent = value;
  }
}
