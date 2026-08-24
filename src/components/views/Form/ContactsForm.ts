import { BaseForm } from "../Form/BaseForm";
import { IEvents } from "../../base/Events";
import { IContactsFormData } from "../../../types";

export class ContactsForm extends BaseForm<IContactsFormData> {
  constructor(events: IEvents) {
    const template = document.getElementById("contacts") as HTMLTemplateElement;
    if (!template) throw new Error("Шаблон contacts не найден в HTML");
    const clone = template.content.firstElementChild!.cloneNode(
      true,
    ) as HTMLElement;

    super(clone, events);
  }
}
