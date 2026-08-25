import { BaseCard } from "./BaseCard";

export class CartItemCard extends BaseCard {
  protected indexElement: HTMLElement | null;
  protected deleteButton: HTMLButtonElement | null;

  // исправлен обработчик
  constructor(container: HTMLElement, actions: { onDeleteClick: () => void }) {
    super(container);

    this.indexElement = container.querySelector(".basket__item-index");
    this.deleteButton = container.querySelector(".basket__item-delete");

    this.deleteButton?.addEventListener("click", actions.onDeleteClick);
  }

  set index(value: number) {
    if (this.indexElement) this.indexElement.textContent = String(value);
  }
}
