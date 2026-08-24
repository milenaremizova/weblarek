import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IModalData } from "../../types";

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );
    this.contentContainer = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close(); // клик именно по оверлею
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentContainer.replaceChildren();
    this.events.emit("modal:close");
  }
}
