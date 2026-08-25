import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBasketData } from "../../types";

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);
    this.priceElement = ensureElement<HTMLElement>(".basket__price", container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.submitButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(elements: HTMLElement[]) {
    this.listElement.replaceChildren(...elements);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
}
