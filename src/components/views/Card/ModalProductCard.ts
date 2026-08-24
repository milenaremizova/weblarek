import { BaseCard } from "./BaseCard";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { CardButtonState } from "../../../types";

export class ModulProductCard extends BaseCard {
  protected buyButton: HTMLButtonElement;

  constructor(events: IEvents) {
    const template = document.getElementById("card-preview") as HTMLTemplateElement;
    if (!template) throw new Error('Шаблон card-preview не найден в HTML');
    const clone = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    super(events, clone);

    this.buyButton = ensureElement<HTMLButtonElement>('.card__button', clone);
    this.buyButton.addEventListener('click', (e) => {
      e.stopPropagation(); // не даём событию всплыть в card:click карточки
      this.events.emit('card:toBasket', { id: this.cardId });
    });
  }

  set buttonState(state: CardButtonState) {
    switch (state) {
      case 'buy':
        this.buyButton.textContent = 'Купить';
        this.buyButton.disabled = false;
        break;
      case 'remove':
        this.buyButton.textContent = 'Удалить из корзины';
        this.buyButton.disabled = false;
        break;
      case 'disabled':
        this.buyButton.textContent = 'Недоступно';
        this.buyButton.disabled = true;
        break;
    }
  }
}