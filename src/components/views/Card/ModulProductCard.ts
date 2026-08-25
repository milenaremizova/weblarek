import { BaseCard } from "./BaseCard";
import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { ICardImage, IButtonState } from "../../../types";

// добавлены картинка, категория, описание, кнопка покупки актуально для карточки в модальном окне
// исправлен обработчик
export class ModulProductCard extends BaseCard {
  protected imgEl: HTMLImageElement | null;
  protected categoryEl: HTMLElement | null;
  protected descEl: HTMLElement | null;
  protected buyButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: { onBuyClick: () => void }) {
    super(container);

    this.imgEl = container.querySelector(".card__image");
    this.categoryEl = container.querySelector(".card__category");
    this.descEl = container.querySelector(".card__text");

    this.buyButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buyButton.addEventListener("click", actions.onBuyClick);
  }

  set image(value: ICardImage) {
    if (this.imgEl) this.setImage(this.imgEl, value.src, value.alt);
  }

  set category(value: string) {
    if (!this.categoryEl) return;
    this.categoryEl.textContent = value;
    this.categoryEl.className = "card__category";
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) this.categoryEl.classList.add(modifier);
  }

  set description(value: string) {
    if (this.descEl) this.descEl.textContent = value;
  }

  set buttonState(value: IButtonState) {
    this.buyButton.textContent = value.text;
    this.buyButton.disabled = value.disabled;
  }
}
