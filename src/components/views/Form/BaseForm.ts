import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { IFormState } from "../../../types";
import { ensureElement } from "../../../utils/utils";

// выбран абстрактный класс, так как от него нельзя создать объект напрямую, потому что используется как база для форм
export abstract class BaseForm<T extends object> extends Component<T & IFormState> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.formElement = container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);

    // слушатели — один раз, в конструкторе
    this.formElement.addEventListener("input", (e) => this.handleInput(e));
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit(`${this.formElement.name}:submit`);
    });
  }

  protected handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.events.emit(`${this.formElement.name}:change`, {
      field: target.name,
      value: target.value,
    });
  }

  // Presenter решает валидность — форма только отображает
  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsContainer.textContent = value;
  }

  reset(): void {
    this.formElement.reset();
  }
}