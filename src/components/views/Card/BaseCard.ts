import { Component } from "../../base/Component";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";
import { ICardData } from "../../../types";


export class BaseCard extends Component<ICardData> {
  protected titleEl: HTMLElement | null;
  protected priceEl: HTMLElement | null;
  protected categoryEl: HTMLElement | null;
  protected imgEl: HTMLImageElement | null;
  protected descEl: HTMLElement | null;

  protected events: IEvents;
  protected data: ICardData;

  constructor(events: IEvents, container: HTMLElement, data: ICardData) {
    super(container);
    this.events = events;
    this.data = data;

    this.titleEl = container.querySelector(".card__title");
    this.priceEl = container.querySelector(".card__price");
    this.categoryEl = container.querySelector(".card__category");
    this.imgEl = container.querySelector(
      ".card__image",
    ) as HTMLImageElement | null;
    this.descEl = container.querySelector(".card__text");

    // слушатель события в конструкторе
    container.addEventListener("click", () => {
      this.events.emit("card:click", this.data);
    });
  }
  render(): HTMLElement {
    const container = this.container;

    // Заголовок
    if (this.titleEl) {
      this.titleEl.textContent = this.data.title;
    }

    // Цена
    if (this.priceEl) {
      this.priceEl.textContent = `${this.data.price} синапсов`;
    }

    if (this.categoryEl) {
      this.categoryEl.textContent = this.data.category;

      // очистка всех модификаторов чтоб не было проблем при переиспользовании
      this.categoryEl.classList.remove(
        "card__category_soft",
        "card__category_hard",
        "card__category_button",
        "card__category_additional",
        "card__category_other",
      );

      const modifierClass =
        categoryMap[this.data.category as keyof typeof categoryMap];

      // 4. Добавляем класс только если он реально существует в мапе
      if (modifierClass) {
        this.categoryEl.classList.add(modifierClass);
      } else {
        // Опционально: можно вывести предупреждение в консоль, если категория неизвестна
        console.warn(
          `Неизвестная категория "${this.data.category}". Класс не назначен.`,
        );
      }
    }

    // --- Картинка ---
    if (this.imgEl) {
      // Используем готовый метод из базового класса Component
      this.setImage(this.imgEl, this.data.image, this.data.title);
    }
    if (this.imgEl) {
  console.log('Путь к картинке:', this.data.image); // <--- Добавь это
  this.setImage(this.imgEl, this.data.image, this.data.title);
} 

    // --- Описание ---
    if (this.descEl) {
      this.descEl.textContent = this.data.description;
    }

    return container;
  }
}
