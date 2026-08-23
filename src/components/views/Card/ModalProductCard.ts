import { BaseCard } from "./BaseCard";
import { ICardData } from "../../../types";
import { IEvents } from "../../base/Events";

export class ModulProductCard extends BaseCard {
  constructor(events: IEvents, data: ICardData) {
    const template = document.getElementById("card-preview") as HTMLTemplateElement;

    if (!template) {
      throw new Error('Шаблон card-preview не найден в HTML');
    };

    const clone = template.content.cloneNode(true) as HTMLElement;

    super(events, clone, data);
  }
}