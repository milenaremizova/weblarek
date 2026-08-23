import { BaseCard } from "./BaseCard";
import { ICardData } from "../../../types";
import { IEvents } from "../../base/Events";

export class CartItemCard extends BaseCard {
  constructor(events: IEvents, data: ICardData) {
    const template = document.getElementById(
      "card-basket",
    ) as HTMLTemplateElement;

    if (!template) {
      throw new Error("Шаблон card-basket не найден в HTML");
    }

    const clone = template.content.cloneNode(true) as HTMLElement;

    super(events, clone, data);
  };
}
