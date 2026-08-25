// src/components/Gallery.ts
import { Component } from "../base/Component";
import { IGallery } from "../../types";

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = container;
  }

  set items(elements: HTMLElement[]) {
    this.catalogElement.replaceChildren(...elements);
  }
}
