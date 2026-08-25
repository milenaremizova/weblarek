import { BaseForm } from "../Form/BaseForm";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";
import { IOrderFormData } from "../../../types";

export class OrderForm extends BaseForm<IOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("order:change", { field: "payment", value: "card" });
    });
    this.cashButton.addEventListener("click", () => {
      this.events.emit("order:change", { field: "payment", value: "cash" });
    });
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");
    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
