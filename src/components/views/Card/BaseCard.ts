import { Component } from "../../base/Component";
import { ICardData } from "../../../types";

// выбран абстрактный класс, так как от него нельзя создать объект напрямую, потому что используется как база для карточек
// базовый класс содержит только те поля, которые актуальны для всех карточек наследников
export abstract class BaseCard extends Component<ICardData> {
  protected titleEl: HTMLElement | null;
  protected priceEl: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);

    this.titleEl = container.querySelector(".card__title");
    this.priceEl = container.querySelector(".card__price");
  }

  set title(value: string) {
    if (this.titleEl) this.titleEl.textContent = value;
  }

  set price(value: number | null) {
    if (this.priceEl) {
      this.priceEl.textContent = value ? `${value} синапсов` : "Бесценно";
    }
  }
}
