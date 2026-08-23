import { BaseCard } from "./BaseCard";
import { ICardData } from "../../../types";
import { IEvents } from "../../base/Events";

export class CatalogCard extends BaseCard {
  constructor(events: IEvents, data: ICardData) {
    const template = document.getElementById(
      "card-catalog",
    ) as HTMLTemplateElement;

    if (!template) {
      throw new Error("Шаблон card-catalog не найден в HTML");
    }

    const clone = template.content.cloneNode(true) as HTMLElement;

    super(events, clone, data);
  }
}
