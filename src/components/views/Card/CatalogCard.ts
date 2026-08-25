import { BaseCard } from "./BaseCard";
import { categoryMap } from "../../../utils/constants";
import { ICardImage } from "../../../types";

// в класс добавлены поля картинки и категории, так как это актуально только для карточки каталога
// исправлен обработчик
export class CatalogCard extends BaseCard {
  protected imgEl: HTMLImageElement | null;
  protected categoryEl: HTMLElement | null;

  constructor(container: HTMLElement, actions: { onClick: () => void }) {
    super(container);

    this.imgEl = container.querySelector(".card__image");
    this.categoryEl = container.querySelector(".card__category");

    container.addEventListener("click", actions.onClick);
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
}
