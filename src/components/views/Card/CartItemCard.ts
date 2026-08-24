import { BaseCard } from "./BaseCard";
import { IEvents } from "../../base/Events";

export class CartItemCard extends BaseCard {
  protected indexElement: HTMLElement | null;
  protected deleteButton: HTMLButtonElement | null;

  constructor(events: IEvents) {
    const template = document.getElementById("card-basket") as HTMLTemplateElement;
    if (!template) throw new Error("Шаблон card-basket не найден в HTML");
    const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    super(events, clone);

    this.indexElement = clone.querySelector('.basket__item-index');
    this.deleteButton = clone.querySelector('.basket__item-delete');

    this.deleteButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.events.emit('basket:remove', { id: this.cardId });
    });
  }

  set index(value: number) {
    if (this.indexElement) this.indexElement.textContent = String(value);
  }
}
